const Resume = require('../models/Resume');
const User = require('../models/User');
const Profile = require('../models/Profile');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

// @desc    Upload resume
// @route   POST /api/resume/upload
// @access  Private
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    const { originalname, path: filePath, size, mimetype } = req.file;

    // Check file type
    const fileType = mimetype === 'application/pdf' ? 'pdf' : 
                     mimetype.includes('word') ? 'docx' : null;

    if (!fileType) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'Only PDF and DOCX files are allowed',
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'resumes',
      resource_type: 'auto',
      public_id: `${req.user._id}-${Date.now()}`,
    });

    // Delete local file
    fs.unlinkSync(filePath);

    // Parse resume based on file type
    let parsedData = {};
    if (fileType === 'pdf') {
      parsedData = await parsePDF(filePath);
    } else {
      parsedData = await parseDOCX(filePath);
    }

    // Create resume document
    const resume = await Resume.create({
      user: req.user._id,
      fileName: originalname,
      fileUrl: result.secure_url,
      fileType,
      fileSize: size,
      parsedData,
      isDefault: true,
    });

    // Update user profile with parsed data
    await updateProfileFromResume(req.user._id, parsedData);

    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user resumes
// @route   GET /api/resume
// @access  Private
exports.getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });

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
// @route   GET /api/resume/:id
// @access  Private
exports.getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
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

// @desc    Delete resume
// @route   DELETE /api/resume/:id
// @access  Private
exports.deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Delete from Cloudinary
    const publicId = resume.fileUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`resumes/${publicId}`);

    await resume.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set default resume
// @route   PUT /api/resume/:id/default
// @access  Private
exports.setDefaultResume = async (req, res, next) => {
  try {
    // Remove default from all resumes
    await Resume.updateMany(
      { user: req.user._id },
      { isDefault: false }
    );

    // Set new default
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isDefault: true },
      { new: true }
    );

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

// Helper function to parse PDF
async function parsePDF(filePath) {
  const pdfParse = require('pdf-parse');
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  
  // Simple parsing - in production, use more sophisticated parsing
  const text = data.text;
  return extractResumeData(text);
}

// Helper function to parse DOCX
async function parseDOCX(filePath) {
  const mammoth = require('mammoth');
  const result = await mammoth.extractRawText({ path: filePath });
  const text = result.value;
  return extractResumeData(text);
}

// Helper function to extract resume data
function extractResumeData(text) {
  const skills = extractSkills(text);
  const technologies = extractTechnologies(text);
  
  return {
    skills,
    technologies,
    experience: [],
    education: [],
    projects: [],
    summary: text.substring(0, 500),
  };
}

// Helper function to extract skills
function extractSkills(text) {
  const commonSkills = [
    'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Python', 'Java',
    'SQL', 'HTML', 'CSS', 'TypeScript', 'Git', 'Docker', 'AWS', 'REST API',
    'GraphQL', 'Redux', 'Next.js', 'Vue.js', 'Angular', 'PostgreSQL', 'MySQL',
    'Docker', 'Kubernetes', 'CI/CD', 'Agile', 'Scrum', 'Jest', 'Testing'
  ];

  const foundSkills = commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );

  return [...new Set(foundSkills)];
}

// Helper function to extract technologies
function extractTechnologies(text) {
  const techStack = [
    'MERN', 'MEAN', 'LAMP', 'PERN', 'JAMstack', 'Serverless',
    'Microservices', 'Monolith', 'SPA', 'PWA', 'SSR', 'CSR'
  ];

  const foundTech = techStack.filter(tech => 
    text.toLowerCase().includes(tech.toLowerCase())
  );

  return [...new Set(foundTech)];
}

// Helper function to update profile from resume
async function updateProfileFromResume(userId, parsedData) {
  try {
    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
      profile = await Profile.create({
        user: userId,
        skills: parsedData.skills || [],
      });
    } else {
      // Merge skills
      const existingSkills = profile.skills || [];
      const newSkills = parsedData.skills || [];
      const mergedSkills = [...new Set([...existingSkills, ...newSkills])];
      profile.skills = mergedSkills;
      await profile.save();
    }
  } catch (error) {
    console.error('Error updating profile from resume:', error);
  }
}
