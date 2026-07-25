const Contact = require('../models/Contact');
const sendEmail = require('../config/email');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Save contact message to database
    try {
      const contact = await Contact.create({
        name,
        email,
        subject,
        message,
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue even if database save fails - still try to send email
    }

    // Send email notification
    try {
      await sendEmail({
        email: process.env.EMAIL_USER, // Send to your email
        subject: `New Contact Form Submission - ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #6366f1;">New Contact Form Submission</h2>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            <p style="color: #666; font-size: 12px;">Submitted on: ${new Date().toLocaleString()}</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.log('Email notification failed:', emailError);
      // Continue even if email fails
    }

    // Send confirmation email to user
    try {
      await sendEmail({
        email: email,
        subject: 'Thank you for contacting InterviewAI',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #6366f1;">Thank you for contacting us!</h2>
            <p>Hi ${name},</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Your Subject:</strong> ${subject}</p>
              <p><strong>Your Message:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            <p>We typically respond within 24-48 hours.</p>
            <p>Best regards,<br>InterviewAI Team</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.log('Confirmation email failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { name, email, subject, message },
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send message',
    });
  }
};

// @desc    Get all contact messages (admin)
// @route   GET /api/contact
// @access  Private (Admin)
exports.getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single contact message
// @route   GET /api/contact/:id
// @access  Private (Admin)
exports.getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact status
// @route   PUT /api/contact/:id
// @access  Private (Admin)
exports.updateContact = async (req, res, next) => {
  try {
    const { status } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact status updated',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact message deleted',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
