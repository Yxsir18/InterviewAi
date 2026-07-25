const groqService = require('./groqService');

/**
 * Analyze resume for ATS score and provide recommendations
 */
async function analyzeResume(resumeData, jobDescription = '') {
  if (!groqService.isAvailable()) {
    throw new Error('AI service not available');
  }

  const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyzer and career coach. Analyze resumes and provide detailed feedback on:
- ATS Score (0-100)
- Missing keywords for ATS optimization
- Resume weaknesses
- Improvement suggestions
- Resume summary
- Recommended technologies to learn
- Recommended certifications to obtain
- Section scores (skills, experience, education, projects, certifications)

Be constructive, specific, and actionable in your feedback.`;

  const userPrompt = `Analyze the following resume data:

Skills: ${resumeData.skills.join(', ')}

Education: ${JSON.stringify(resumeData.education, null, 2)}

Experience: ${JSON.stringify(resumeData.experience, null, 2)}

Projects: ${JSON.stringify(resumeData.projects, null, 2)}

Certifications: ${JSON.stringify(resumeData.certifications, null, 2)}

${jobDescription ? `Target Job Description: ${jobDescription}` : ''}

Provide your analysis in JSON format with:
{
  "atsScore": 0-100,
  "missingKeywords": ["keyword1", "keyword2"],
  "weaknesses": ["weakness1", "weakness2"],
  "improvementSuggestions": ["suggestion1", "suggestion2"],
  "summary": "brief summary of the resume",
  "recommendedTechnologies": ["tech1", "tech2"],
  "recommendedCertifications": ["cert1", "cert2"],
  "sectionScores": {
    "skills": 0-100,
    "experience": 0-100,
    "education": 0-100,
    "projects": 0-100,
    "certifications": 0-100
  },
  "sectionsNeedingImprovement": ["section1", "section2"]
}`;

  try {
    const Groq = require('groq-sdk');
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 2048,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw error;
  }
}

module.exports = {
  analyzeResume,
};
