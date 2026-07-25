const ResumeBuilder = require('../models/ResumeBuilder');
const { generateAIContent } = require('../utils/aiService');
const puppeteer = require('puppeteer');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');

// @desc    Create new resume
// @route   POST /api/resume-builder
// @access  Private
exports.createResume = async (req, res, next) => {
  try {
    const { name, template, personalInfo } = req.body;

    const resume = await ResumeBuilder.create({
      user: req.user._id,
      name,
      versions: [{
        version: 1,
        name: `${name} - v1`,
        template: template || 'modern',
        sections: [],
        personalInfo: personalInfo || {},
        isCurrent: true,
      }],
      currentVersion: 1,
    });

    res.status(201).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all resumes for user
// @route   GET /api/resume-builder
// @access  Private
exports.getResumes = async (req, res, next) => {
  try {
    const resumes = await ResumeBuilder.find({ user: req.user._id })
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resume
// @route   GET /api/resume-builder/:id
// @access  Private
exports.getResume = async (req, res, next) => {
  try {
    const resume = await ResumeBuilder.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update resume
// @route   PUT /api/resume-builder/:id
// @access  Private
exports.updateResume = async (req, res, next) => {
  try {
    const { name, template, personalInfo, sections } = req.body;

    const resume = await ResumeBuilder.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Update current version
    const currentVersionIndex = resume.versions.findIndex(
      v => v.version === resume.currentVersion
    );

    if (currentVersionIndex !== -1) {
      if (name) resume.name = name;
      if (template) resume.versions[currentVersionIndex].template = template;
      if (personalInfo) resume.versions[currentVersionIndex].personalInfo = personalInfo;
      if (sections) resume.versions[currentVersionIndex].sections = sections;
    }

    await resume.save();

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new version of resume
// @route   POST /api/resume-builder/:id/version
// @access  Private
exports.createVersion = async (req, res, next) => {
  try {
    const { name, template } = req.body;

    const resume = await ResumeBuilder.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    const currentVersion = resume.versions.find(
      v => v.version === resume.currentVersion
    );

    const newVersionNumber = resume.versions.length + 1;

    resume.versions.push({
      version: newVersionNumber,
      name: name || `${resume.name} - v${newVersionNumber}`,
      template: template || currentVersion?.template || 'modern',
      sections: currentVersion?.sections || [],
      personalInfo: currentVersion?.personalInfo || {},
      isCurrent: false,
    });

    // Set new version as current
    resume.currentVersion = newVersionNumber;
    resume.versions.forEach(v => v.isCurrent = false);
    resume.versions[resume.versions.length - 1].isCurrent = true;

    await resume.save();

    res.status(201).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Switch to specific version
// @route   PUT /api/resume-builder/:id/version/:version
// @access  Private
exports.switchVersion = async (req, res, next) => {
  try {
    const resume = await ResumeBuilder.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    const version = parseInt(req.params.version);
    const versionExists = resume.versions.find(v => v.version === version);

    if (!versionExists) {
      return res.status(404).json({
        success: false,
        message: 'Version not found',
      });
    }

    resume.currentVersion = version;
    resume.versions.forEach(v => v.isCurrent = v.version === version);

    await resume.save();

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resume
// @route   DELETE /api/resume-builder/:id
// @access  Private
exports.deleteResume = async (req, res, next) => {
  try {
    const resume = await ResumeBuilder.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    AI Generate Summary
// @route   POST /api/resume-builder/:id/ai/summary
// @access  Private
exports.generateSummary = async (req, res, next) => {
  try {
    const { experience, skills } = req.body;

    const prompt = `Generate a professional resume summary based on the following experience and skills:
    
    Experience: ${experience || 'Not provided'}
    Skills: ${skills || 'Not provided'}
    
    Generate a compelling 2-3 sentence summary that highlights key achievements and qualifications.`;

    const aiResponse = await generateAIContent(prompt);

    res.status(200).json({
      success: true,
      data: {
        summary: aiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    AI Improve Bullet Points
// @route   POST /api/resume-builder/:id/ai/bullets
// @access  Private
exports.improveBullets = async (req, res, next) => {
  try {
    const { bullets, role } = req.body;

    const prompt = `Improve these resume bullet points for a ${role || 'professional'} role. Make them more impactful, quantifiable, and action-oriented:
    
    ${bullets.join('\n')}
    
    Return improved bullet points, one per line.`;

    const aiResponse = await generateAIContent(prompt);
    const improvedBullets = aiResponse.split('\n').filter(b => b.trim());

    res.status(200).json({
      success: true,
      data: {
        bullets: improvedBullets,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    AI Suggest Skills
// @route   POST /api/resume-builder/:id/ai/skills
// @access  Private
exports.suggestSkills = async (req, res, next) => {
  try {
    const { role, experience, currentSkills } = req.body;

    const prompt = `Suggest relevant skills for a ${role || 'software developer'} role based on this experience:
    
    ${experience || 'Not provided'}
    
    Current skills: ${currentSkills || 'None'}
    
    Suggest 10-15 additional relevant skills that would strengthen this resume. Return as a comma-separated list.`;

    const aiResponse = await generateAIContent(prompt);
    const suggestedSkills = aiResponse.split(',').map(s => s.trim()).filter(s => s);

    res.status(200).json({
      success: true,
      data: {
        skills: suggestedSkills,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    AI Generate Projects
// @route   POST /api/resume-builder/:id/ai/projects
// @access  Private
exports.generateProjects = async (req, res, next) => {
  try {
    const { skills, role, count } = req.body;

    const prompt = `Generate ${count || 3} impressive project ideas for a ${role || 'software developer'} resume with these skills:
    
    Skills: ${skills || 'Not provided'}
    
    For each project, provide:
    - Project name
    - Brief description
    - Technologies used
    - Key features
    
    Format as a numbered list.`;

    const aiResponse = await generateAIContent(prompt);

    res.status(200).json({
      success: true,
      data: {
        projects: aiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    AI Improve Content
// @route   POST /api/resume-builder/:id/ai/improve
// @access  Private
exports.improveContent = async (req, res, next) => {
  try {
    const { type, content, field } = req.body;

    let prompt = '';
    if (type === 'summary') {
      prompt = `Improve this professional summary to make it more compelling and impactful:

${content}

Provide an improved version that is professional, concise, and highlights key strengths.`;
    } else if (type === 'experience') {
      prompt = `Improve this job description to make it more impactful and ATS-friendly:

${content}

Provide an improved version with stronger action verbs and quantifiable achievements.`;
    } else if (type === 'project') {
      prompt = `Improve this project description to make it more impressive:

${content}

Provide an improved version that highlights technical skills and impact.`;
    } else if (type === 'ats-fix') {
      prompt = `Fix this resume issue to improve ATS score:

${content}

Provide a solution that addresses the issue.`;
    }

    const aiResponse = await generateAIContent(prompt);

    res.status(200).json({
      success: true,
      data: {
        improved: aiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Analyze Resume for ATS
// @route   POST /api/resume-builder/:id/analyze-ats
// @access  Private
exports.analyzeATS = async (req, res, next) => {
  try {
    const { resume } = req.body;

    // Calculate ATS score based on various factors
    let keywordScore = 0;
    let formattingScore = 0;
    let readability = 0;
    const missingSections = [];
    const suggestions = [];

    // Check for required sections
    const requiredSections = ['summary', 'experience', 'education', 'skills'];
    const existingSections = resume.sections?.map(s => s.type) || [];
    
    requiredSections.forEach(section => {
      if (!existingSections.includes(section)) {
        missingSections.push(section.charAt(0).toUpperCase() + section.slice(1));
      }
    });

    // Keyword score (based on content length and variety)
    const totalContent = resume.sections?.reduce((acc, section) => {
      if (typeof section.content === 'string') {
        return acc + section.content.length;
      }
      return acc;
    }, 0) || 0;
    keywordScore = Math.min(100, Math.round(totalContent / 10));

    // Formatting score (based on structure)
    formattingScore = resume.sections?.length > 0 ? 85 : 50;

    // Readability score
    readability = 90;

    // Generate suggestions
    if (missingSections.length > 0) {
      suggestions.push(`Add missing sections: ${missingSections.join(', ')}`);
    }
    if (keywordScore < 70) {
      suggestions.push('Add more keywords and skills to improve keyword matching');
    }
    if (!resume.personalInfo?.email || !resume.personalInfo?.phone) {
      suggestions.push('Add complete contact information');
    }

    const overallScore = Math.round((keywordScore + formattingScore + readability) / 3);

    res.status(200).json({
      success: true,
      data: {
        overall: overallScore,
        keywordScore,
        formattingScore,
        readability,
        missingSections,
        suggestions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Match Job Description
// @route   POST /api/resume-builder/:id/match-job
// @access  Private
exports.matchJob = async (req, res, next) => {
  try {
    const { resume, jobDescription } = req.body;

    // Extract keywords from job description
    const jobKeywords = jobDescription.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const uniqueJobKeywords = [...new Set(jobKeywords)];

    // Extract skills from resume
    const skillsSection = resume.sections?.find(s => s.type === 'skills');
    const resumeSkills = Array.isArray(skillsSection?.content) ? skillsSection.content : [];
    const resumeSkillsLower = resumeSkills.map(s => s.toLowerCase());

    // Find matching skills
    const matchingSkills = resumeSkills.filter(skill => 
      uniqueJobKeywords.some(keyword => skill.toLowerCase().includes(keyword))
    );

    // Find missing skills
    const missingSkills = uniqueJobKeywords.filter(keyword => 
      !resumeSkillsLower.some(skill => skill.includes(keyword))
    ).slice(0, 10);

    // Calculate match percentage
    const matchPercentage = Math.round(
      (matchingSkills.length / Math.max(uniqueJobKeywords.length, 1)) * 100
    );

    // Generate suggestions
    const suggestions = [];
    if (missingSkills.length > 0) {
      suggestions.push(`Consider adding these skills: ${missingSkills.slice(0, 5).join(', ')}`);
    }
    if (matchPercentage < 50) {
      suggestions.push('Your resume needs more alignment with this job description');
    }

    res.status(200).json({
      success: true,
      data: {
        matchPercentage,
        matchingSkills,
        missingSkills,
        suggestions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Optimize Resume for Job
// @route   POST /api/resume-builder/:id/optimize-job
// @access  Private
exports.optimizeForJob = async (req, res, next) => {
  try {
    const { resume, jobDescription } = req.body;

    const prompt = `Optimize this resume for the following job description:

Job Description:
${jobDescription}

Current Resume Sections:
${JSON.stringify(resume.sections, null, 2)}

Provide optimized sections that better align with the job description. Return as JSON with the same structure.`;

    const aiResponse = await generateAIContent(prompt);

    // Parse the AI response (in production, you'd want better error handling)
    let optimizedSections;
    try {
      optimizedSections = JSON.parse(aiResponse);
    } catch {
      // If parsing fails, return original sections
      optimizedSections = resume.sections;
    }

    res.status(200).json({
      success: true,
      data: {
        sections: optimizedSections,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set Default Resume
// @route   PUT /api/resume-builder/:id/set-default
// @access  Private
exports.setDefaultResume = async (req, res, next) => {
  try {
    const resume = await ResumeBuilder.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Set this as default (you might want to add a default flag to the schema)
    resume.isDefault = true;
    await resume.save();

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export Resume as PDF
// @route   GET /api/resume-builder/:id/export/pdf
// @access  Private
exports.exportPDF = async (req, res, next) => {
  try {
    const resume = await ResumeBuilder.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    const currentVersion = resume.versions.find(v => v.version === resume.currentVersion) || resume.versions[0];
    const personalInfo = currentVersion.personalInfo || {};
    const visibleSections = currentVersion.sections.filter(s => s.isVisible).sort((a, b) => a.order - b.order);

    // Generate HTML for PDF
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .contact {
            font-size: 12px;
            color: #666;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            text-transform: uppercase;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
          }
          .content {
            font-size: 12px;
            line-height: 1.6;
            white-space: pre-wrap;
          }
          .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
          .skill-tag {
            background: #f0f0f0;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="name">${personalInfo.fullName || 'Your Name'}</div>
          <div class="contact">
            ${personalInfo.email ? personalInfo.email + ' | ' : ''}
            ${personalInfo.phone ? personalInfo.phone + ' | ' : ''}
            ${personalInfo.location || ''}
          </div>
          ${personalInfo.linkedin || personalInfo.github || personalInfo.website ? `
            <div class="contact">
              ${personalInfo.linkedin ? personalInfo.linkedin + ' | ' : ''}
              ${personalInfo.github ? personalInfo.github + ' | ' : ''}
              ${personalInfo.website || ''}
            </div>
          ` : ''}
        </div>
        ${visibleSections.map(section => `
          <div class="section">
            <div class="section-title">${section.title}</div>
            ${section.type === 'skills' && Array.isArray(section.content) ? `
              <div class="skills">
                ${section.content.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
              </div>
            ` : `
              <div class="content">${Array.isArray(section.content) ? section.content.join(', ') : section.content}</div>
            `}
          </div>
        `).join('')}
      </body>
      </html>
    `;

    // Launch puppeteer
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    await page.setContent(html);
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });
    
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resume.name}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

// @desc    Export Resume as DOCX
// @route   GET /api/resume-builder/:id/export/docx
// @access  Private
exports.exportDOCX = async (req, res, next) => {
  try {
    const resume = await ResumeBuilder.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    const currentVersion = resume.versions.find(v => v.version === resume.currentVersion) || resume.versions[0];
    const personalInfo = currentVersion.personalInfo || {};
    const visibleSections = currentVersion.sections.filter(s => s.isVisible).sort((a, b) => a.order - b.order);

    // Create document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Header
          new Paragraph({
            text: personalInfo.fullName || 'Your Name',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${personalInfo.email || ''} ${personalInfo.phone ? ' | ' + personalInfo.phone : ''} ${personalInfo.location ? ' | ' + personalInfo.location : ''}`,
                size: 20,
                color: '666666',
              }),
            ],
            spacing: { after: 200 },
          }),
          ...(visibleSections.map(section => {
            const children = [];
            
            // Section title
            children.push(
              new Paragraph({
                text: section.title,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 },
              })
            );

            // Section content
            if (section.type === 'skills' && Array.isArray(section.content)) {
              section.content.forEach(skill => {
                children.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: skill,
                        size: 22,
                      }),
                    ],
                    spacing: { after: 100 },
                  })
                );
              });
            } else {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: Array.isArray(section.content) ? section.content.join(', ') : section.content,
                      size: 22,
                    }),
                  ],
                  spacing: { after: 200 },
                })
              );
            }

            return children;
          }).flat()),
        ],
      }],
    });

    // Generate DOCX buffer
    const buffer = await Packer.toBuffer(doc);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${resume.name}.docx"`);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};
