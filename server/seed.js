const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/interviewai');
    console.log('✅ MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@interviewai.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log('Email: admin@interviewai.com');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@interviewai.com',
      password: 'admin123',
      role: 'admin',
      isEmailVerified: true,
      isActive: true,
    });

    console.log('✅ Admin user created successfully');
    console.log('Email: admin@interviewai.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
