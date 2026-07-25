const Profile = require('../models/Profile');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const path = require('path');

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id })
      .populate('user', 'name email avatar role isEmailVerified');

    if (!profile) {
      // Create profile if it doesn't exist
      profile = await Profile.create({
        user: req.user._id,
      });
      profile = await Profile.findById(profile._id).populate('user', 'name email avatar role isEmailVerified');
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      bio,
      phone,
      location,
      website,
      linkedin,
      github,
      skills,
      experience,
      education,
      projects,
    } = req.body;

    let profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      profile = await Profile.create({ user: req.user._id });
    }

    // Update basic info
    if (bio !== undefined) profile.bio = bio;
    if (phone !== undefined) profile.phone = phone;
    if (location !== undefined) profile.location = location;
    if (website !== undefined) profile.website = website;
    if (linkedin !== undefined) profile.linkedin = linkedin;
    if (github !== undefined) profile.github = github;
    if (skills !== undefined) profile.skills = skills;
    if (experience !== undefined) profile.experience = experience;
    if (education !== undefined) profile.education = education;
    if (projects !== undefined) profile.projects = projects;

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user info
// @route   PUT /api/profile/user
// @access  Private
exports.updateUserInfo = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (email) {
      // Check if email is already taken
      const emailExists = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use',
        });
      }
      user.email = email;
      user.isEmailVerified = false; // Require re-verification
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User info updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload avatar
// @route   POST /api/profile/avatar
// @access  Private
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    console.log('File received:', req.file);
    console.log('Cloudinary config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      has_api_key: !!process.env.CLOUDINARY_API_KEY,
      has_secret: !!process.env.CLOUDINARY_API_SECRET,
    });

    let avatarUrl;

    // Try Cloudinary upload first
    try {
      if (process.env.CLOUDINARY_CLOUD_NAME && 
          process.env.CLOUDINARY_API_KEY && 
          process.env.CLOUDINARY_API_SECRET) {
        
        console.log('Attempting Cloudinary upload...');
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'avatars',
          width: 150,
          height: 150,
          crop: 'fill',
          public_id: `${req.user._id}-avatar`,
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
          resource_type: 'image',
        });
        
        console.log('Cloudinary upload successful:', result.public_id);
        avatarUrl = result.secure_url;
      } else {
        throw new Error('Cloudinary credentials not configured');
      }
    } catch (cloudinaryError) {
      console.error('Cloudinary upload failed, using local storage:', cloudinaryError.message);
      
      // Fallback to local storage - use API endpoint instead of direct file access
      avatarUrl = `/api/profile/avatar/${req.file.filename}`;
      console.log('Using local avatar URL:', avatarUrl);
    }

    // Update user avatar
    const user = await User.findById(req.user._id);
    user.avatar = avatarUrl;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatar: avatarUrl,
      },
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    next(error);
  }
};

// @desc    Get avatar image
// @route   GET /api/profile/avatar/:filename
// @access  Public
exports.getAvatar = async (req, res, next) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    
    // Check if file exists
    if (require('fs').existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({
        success: false,
        message: 'Avatar not found',
      });
    }
  } catch (error) {
    console.error('Avatar fetch error:', error);
    next(error);
  }
};

// @desc    Add experience
// @route   POST /api/profile/experience
// @access  Private
exports.addExperience = async (req, res, next) => {
  try {
    const { title, company, location, startDate, endDate, current, description } = req.body;

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    profile.experience.push({
      title,
      company,
      location,
      startDate,
      endDate,
      current,
      description,
    });

    await profile.save();

    res.status(201).json({
      success: true,
      message: 'Experience added successfully',
      data: profile.experience[profile.experience.length - 1],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update experience
// @route   PUT /api/profile/experience/:id
// @access  Private
exports.updateExperience = async (req, res, next) => {
  try {
    const { title, company, location, startDate, endDate, current, description } = req.body;

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    const experience = profile.experience.id(req.params.id);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found',
      });
    }

    if (title !== undefined) experience.title = title;
    if (company !== undefined) experience.company = company;
    if (location !== undefined) experience.location = location;
    if (startDate !== undefined) experience.startDate = startDate;
    if (endDate !== undefined) experience.endDate = endDate;
    if (current !== undefined) experience.current = current;
    if (description !== undefined) experience.description = description;

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Experience updated successfully',
      data: experience,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete experience
// @route   DELETE /api/profile/experience/:id
// @access  Private
exports.deleteExperience = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    const experience = profile.experience.id(req.params.id);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found',
      });
    }

    experience.deleteOne();
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Experience deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add education
// @route   POST /api/profile/education
// @access  Private
exports.addEducation = async (req, res, next) => {
  try {
    const { school, degree, field, startDate, endDate, current, description } = req.body;

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    profile.education.push({
      school,
      degree,
      field,
      startDate,
      endDate,
      current,
      description,
    });

    await profile.save();

    res.status(201).json({
      success: true,
      message: 'Education added successfully',
      data: profile.education[profile.education.length - 1],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update education
// @route   PUT /api/profile/education/:id
// @access  Private
exports.updateEducation = async (req, res, next) => {
  try {
    const { school, degree, field, startDate, endDate, current, description } = req.body;

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    const education = profile.education.id(req.params.id);
    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education not found',
      });
    }

    if (school !== undefined) education.school = school;
    if (degree !== undefined) education.degree = degree;
    if (field !== undefined) education.field = field;
    if (startDate !== undefined) education.startDate = startDate;
    if (endDate !== undefined) education.endDate = endDate;
    if (current !== undefined) education.current = current;
    if (description !== undefined) education.description = description;

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Education updated successfully',
      data: education,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete education
// @route   DELETE /api/profile/education/:id
// @access  Private
exports.deleteEducation = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    const education = profile.education.id(req.params.id);
    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education not found',
      });
    }

    education.deleteOne();
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Education deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add project
// @route   POST /api/profile/projects
// @access  Private
exports.addProject = async (req, res, next) => {
  try {
    const { name, description, technologies, link, startDate, endDate } = req.body;

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    profile.projects.push({
      name,
      description,
      technologies,
      link,
      startDate,
      endDate,
    });

    await profile.save();

    res.status(201).json({
      success: true,
      message: 'Project added successfully',
      data: profile.projects[profile.projects.length - 1],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/profile/projects/:id
// @access  Private
exports.updateProject = async (req, res, next) => {
  try {
    const { name, description, technologies, link, startDate, endDate } = req.body;

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    const project = profile.projects.id(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (technologies !== undefined) project.technologies = technologies;
    if (link !== undefined) project.link = link;
    if (startDate !== undefined) project.startDate = startDate;
    if (endDate !== undefined) project.endDate = endDate;

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/profile/projects/:id
// @access  Private
exports.deleteProject = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    const project = profile.projects.id(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    project.deleteOne();
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
