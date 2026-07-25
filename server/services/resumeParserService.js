const pdf = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Parse PDF resume
 */
async function parsePDF(buffer) {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file');
  }
}

/**
 * Parse DOCX resume
 */
async function parseDOCX(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse DOCX file');
  }
}

/**
 * Extract information from resume text
 */
function extractResumeData(text) {
  const data = {
    skills: extractSkills(text),
    education: extractEducation(text),
    experience: extractExperience(text),
    projects: extractProjects(text),
    certifications: extractCertifications(text),
  };
  
  return data;
}

/**
 * Extract skills from resume text
 */
function extractSkills(text) {
  const skills = [];
  const skillPatterns = [
    /(?:skills|technologies|tech stack|programming languages)[:\s]*([^\n]+)/gi,
    /(?:javascript|python|java|c\+\+|react|angular|vue|node\.js|express|mongodb|postgresql|mysql|docker|kubernetes|aws|azure|gcp|git|agile|scrum|rest api|graphql|typescript|html|css|sass|webpack|babel|jest|cypress|selenium)/gi,
  ];
  
  skillPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const extracted = match
          .replace(/(?:skills|technologies|tech stack|programming languages)[:\s]*/gi, '')
          .split(/[,\n•\-\*]/)
          .map(s => s.trim())
          .filter(s => s.length > 2);
        skills.push(...extracted);
      });
    }
  });
  
  return [...new Set(skills)]; // Remove duplicates
}

/**
 * Extract education from resume text
 */
function extractEducation(text) {
  const education = [];
  const educationPattern = /(?:education|academic|university|college|school)[:\s]*([^\n]+)/gi;
  const degreePattern = /(?:bachelor|master|phd|doctorate|b\.s\.|m\.s\.|b\.a\.|m\.a\.|b\.tech|m\.tech)/gi;
  
  const lines = text.split('\n');
  let currentEducation = null;
  
  lines.forEach(line => {
    if (educationPattern.test(line)) {
      if (currentEducation) {
        education.push(currentEducation);
      }
      currentEducation = {
        institution: line.replace(/(?:education|academic|university|college|school)[:\s]*/gi, '').trim(),
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: '',
      };
    } else if (currentEducation && degreePattern.test(line)) {
      currentEducation.degree = line.trim();
    } else if (currentEducation && line.match(/\d{4}/)) {
      const dates = line.match(/\d{4}/g);
      if (dates && dates.length >= 1) {
        currentEducation.startDate = dates[0];
        if (dates.length >= 2) {
          currentEducation.endDate = dates[1];
        }
      }
    }
  });
  
  if (currentEducation) {
    education.push(currentEducation);
  }
  
  return education;
}

/**
 * Extract experience from resume text
 */
function extractExperience(text) {
  const experience = [];
  const experiencePattern = /(?:experience|work history|employment|professional experience)[:\s]*([^\n]+)/gi;
  const companyPattern = /(?:at|@|company)[:\s]*([^\n]+)/gi;
  
  const lines = text.split('\n');
  let currentExperience = null;
  
  lines.forEach(line => {
    if (experiencePattern.test(line)) {
      if (currentExperience) {
        experience.push(currentExperience);
      }
      currentExperience = {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
      };
    } else if (currentExperience && companyPattern.test(line)) {
      currentExperience.company = line.replace(/(?:at|@|company)[:\s]*/gi, '').trim();
    } else if (currentExperience && line.match(/\d{4}/)) {
      const dates = line.match(/\d{4}/g);
      if (dates && dates.length >= 1) {
        currentExperience.startDate = dates[0];
        if (dates.length >= 2) {
          currentExperience.endDate = dates[1];
        }
      }
    } else if (currentExperience && line.trim().length > 10) {
      currentExperience.description += line.trim() + ' ';
    }
  });
  
  if (currentExperience) {
    experience.push(currentExperience);
  }
  
  return experience;
}

/**
 * Extract projects from resume text
 */
function extractProjects(text) {
  const projects = [];
  const projectPattern = /(?:projects|portfolio|personal projects)[:\s]*([^\n]+)/gi;
  
  const lines = text.split('\n');
  let currentProject = null;
  
  lines.forEach(line => {
    if (projectPattern.test(line)) {
      if (currentProject) {
        projects.push(currentProject);
      }
      currentProject = {
        name: line.replace(/(?:projects|portfolio|personal projects)[:\s]*/gi, '').trim(),
        description: '',
        technologies: [],
        startDate: '',
        endDate: '',
      };
    } else if (currentProject && line.trim().length > 5) {
      if (line.match(/(?:react|angular|vue|node|python|java|javascript)/gi)) {
        currentProject.technologies = line.match(/(?:react|angular|vue|node|python|java|javascript)/gi) || [];
      } else {
        currentProject.description += line.trim() + ' ';
      }
    }
  });
  
  if (currentProject) {
    projects.push(currentProject);
  }
  
  return projects;
}

/**
 * Extract certifications from resume text
 */
function extractCertifications(text) {
  const certifications = [];
  const certPattern = /(?:certifications|certificates|credentials)[:\s]*([^\n]+)/gi;
  const commonCerts = [
    'aws certified', 'google cloud certified', 'azure certified', 
    'pmp', 'scrum master', 'six sigma', 'cfa', 'cisa', 'cism',
    'comptia', 'ccna', 'ccnp', 'mcse', 'oracle certified'
  ];
  
  const lines = text.split('\n');
  let inCertSection = false;
  
  lines.forEach(line => {
    if (certPattern.test(line)) {
      inCertSection = true;
      return;
    }
    
    if (inCertSection) {
      if (line.trim().length === 0 || line.match(/^(?:skills|experience|education|projects)/i)) {
        inCertSection = false;
        return;
      }
      
      const cert = {
        name: line.trim(),
        issuer: '',
        date: '',
        expiryDate: '',
      };
      
      commonCerts.forEach(commonCert => {
        if (line.toLowerCase().includes(commonCert)) {
          cert.name = commonCert.charAt(0).toUpperCase() + commonCert.slice(1);
        }
      });
      
      if (cert.name.length > 3) {
        certifications.push(cert);
      }
    }
  });
  
  return certifications;
}

module.exports = {
  parsePDF,
  parseDOCX,
  extractResumeData,
};
