const User = require('../models/User');

// @desc    Get user settings
// @route   GET /api/settings
// @access  Private
exports.getSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Return user settings (can be expanded to include more settings)
    res.status(200).json({
      success: true,
      data: {
        notifications: user.notifications || {
          email: true,
          push: false,
          interviewReminders: true,
          weeklyReports: true,
        },
        privacy: user.privacy || {
          profileVisibility: 'public',
          showInterviewHistory: true,
          showCertificates: true,
        },
        theme: user.theme || 'dark',
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user settings
// @route   PUT /api/settings
// @access  Private
exports.updateSettings = async (req, res, next) => {
  try {
    const { notifications, privacy, theme } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update settings
    if (notifications !== undefined) {
      user.notifications = { ...user.notifications, ...notifications };
    }
    if (privacy !== undefined) {
      user.privacy = { ...user.privacy, ...privacy };
    }
    if (theme !== undefined) {
      user.theme = theme;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        notifications: user.notifications,
        privacy: user.privacy,
        theme: user.theme,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/settings/password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete account
// @route   DELETE /api/settings/account
// @access  Private
exports.deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your password to confirm account deletion',
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Password is incorrect',
      });
    }

    // Delete user (cascade delete will handle related data)
    await User.findByIdAndDelete(req.user._id);

    // Also delete associated profile if exists
    const Profile = require('../models/Profile');
    await Profile.findOneAndDelete({ user: req.user._id });

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
