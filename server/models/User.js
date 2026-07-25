const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  role: {
    type: String,
    enum: ['candidate', 'admin'],
    default: 'candidate',
  },
  avatar: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'banned', 'pending'],
    default: 'active',
  },
  subscription: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free',
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  resetPasswordOTP: String,
  resetPasswordOTPExpire: Date,
  refreshToken: String,
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  notifications: {
    email: {
      type: Boolean,
      default: true,
    },
    push: {
      type: Boolean,
      default: false,
    },
    interviewReminders: {
      type: Boolean,
      default: true,
    },
    weeklyReports: {
      type: Boolean,
      default: true,
    },
  },
  privacy: {
    profileVisibility: {
      type: String,
      enum: ['public', 'private', 'friends'],
      default: 'public',
    },
    showInterviewHistory: {
      type: Boolean,
      default: true,
    },
    showCertificates: {
      type: Boolean,
      default: true,
    },
  },
  theme: {
    type: String,
    enum: ['dark', 'light'],
    default: 'dark',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Update timestamp
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Alias for matchPassword (used in settings controller)
userSchema.methods.matchPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate email verification token
userSchema.methods.getEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return verificationToken;
};

// Generate password reset OTP
userSchema.methods.getResetPasswordOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  this.resetPasswordOTP = otp;
  this.resetPasswordOTPExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return otp;
};

// Generate password reset token (legacy)
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
