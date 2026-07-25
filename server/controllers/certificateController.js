const Certificate = require('../models/Certificate');
const User = require('../models/User');
const Interview = require('../models/Interview');
const Report = require('../models/Report');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// @desc    Get all certificates for a user
// @route   GET /api/certificates
// @access  Private
exports.getUserCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ user: req.user._id })
      .populate('interview', 'title type difficulty')
      .populate('report', 'score totalQuestions')
      .sort({ issuedDate: -1 });

    res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates,
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificates',
      error: error.message,
    });
  }
};

// @desc    Get single certificate by ID
// @route   GET /api/certificates/:id
// @access  Private
exports.getCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate('interview', 'title type difficulty')
      .populate('report', 'score totalQuestions')
      .populate('user', 'name email');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }

    res.status(200).json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    console.error('Error fetching certificate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificate',
      error: error.message,
    });
  }
};

// @desc    Download certificate as PDF
// @route   GET /api/certificates/:id/download
// @access  Private
exports.downloadCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate('interview', 'title type difficulty')
      .populate('report', 'score totalQuestions')
      .populate('user', 'name email');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }

    // Create PDF
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margin: 50,
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Certificate-${certificate.certificateNumber}.pdf"`
    );

    // Pipe PDF to response
    doc.pipe(res);

    // Certificate design
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // Background
    doc.rect(0, 0, pageWidth, pageHeight).fill('#f8f9fa');

    // Border
    doc.lineWidth(3);
    doc.strokeColor('#d4af37'); // Gold color
    doc.rect(25, 25, pageWidth - 50, pageHeight - 50).stroke();

    // Inner border
    doc.lineWidth(1);
    doc.rect(35, 35, pageWidth - 70, pageHeight - 70).stroke();

    // Header
    doc.fontSize(24).fillColor('#2c3e50').font('Helvetica-Bold');
    doc.text('Certificate of Achievement', { align: 'center' });

    // Line
    doc.moveTo(200, 80).lineTo(pageWidth - 200, 80).lineWidth(2).strokeColor('#d4af37').stroke();

    // Content
    doc.fontSize(16).fillColor('#34495e').font('Helvetica');
    doc.text('This is to certify that', { align: 'center' });
    doc.moveDown();

    // User name
    doc.fontSize(28).fillColor('#2c3e50').font('Helvetica-Bold');
    doc.text(certificate.user.name, { align: 'center' });
    doc.moveDown();

    doc.fontSize(16).fillColor('#34495e').font('Helvetica');
    doc.text('has successfully completed the', { align: 'center' });
    doc.moveDown();

    // Interview type
    doc.fontSize(24).fillColor('#d4af37').font('Helvetica-Bold');
    doc.text(certificate.interview.title || certificate.interview.type, { align: 'center' });
    doc.moveDown();

    doc.fontSize(16).fillColor('#34495e').font('Helvetica');
    doc.text('Interview Assessment', { align: 'center' });
    doc.moveDown();

    // Score
    doc.fontSize(20).fillColor('#27ae60').font('Helvetica-Bold');
    doc.text(`Score: ${certificate.score}%`, { align: 'center' });
    doc.moveDown();

    // Details
    doc.fontSize(14).fillColor('#7f8c8d').font('Helvetica');
    doc.text(`Difficulty: ${certificate.difficulty}`, { align: 'center' });
    doc.text(`Certificate Number: ${certificate.certificateNumber}`, { align: 'center' });
    doc.text(`Issued Date: ${new Date(certificate.issuedDate).toLocaleDateString()}`, { align: 'center' });
    doc.moveDown();

    // Footer
    doc.fontSize(12).fillColor('#95a5a6').font('Helvetica');
    doc.text('This certificate is issued by InterviewAI', { align: 'center' });
    doc.text('A digital verification of technical skills and knowledge', { align: 'center' });

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error('Error downloading certificate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download certificate',
      error: error.message,
    });
  }
};

// @desc    Verify certificate
// @route   GET /api/certificates/verify/:certificateNumber
// @access  Public
exports.verifyCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({
      certificateNumber: req.params.certificateNumber,
    })
      .populate('interview', 'title type difficulty')
      .populate('report', 'score totalQuestions')
      .populate('user', 'name');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found or invalid',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        isValid: true,
        certificateNumber: certificate.certificateNumber,
        holder: certificate.user.name,
        interviewType: certificate.interview.title || certificate.interview.type,
        score: certificate.score,
        difficulty: certificate.difficulty,
        issuedDate: certificate.issuedDate,
      },
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify certificate',
      error: error.message,
    });
  }
};

// @desc    Create certificate after interview completion
// @route   POST /api/certificates
// @access  Private
exports.createCertificate = async (req, res, next) => {
  try {
    const { interviewId, reportId } = req.body;

    // Get interview and report
    const interview = await Interview.findById(interviewId);
    const report = await Report.findById(reportId);

    if (!interview || !report) {
      return res.status(404).json({
        success: false,
        message: 'Interview or report not found',
      });
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      interview: interviewId,
      report: reportId,
      user: req.user._id,
    });

    if (existingCertificate) {
      return res.status(400).json({
        success: false,
        message: 'Certificate already exists for this interview',
      });
    }

    // Create certificate
    const certificate = await Certificate.create({
      user: req.user._id,
      interview: interviewId,
      report: reportId,
      score: report.score,
      interviewType: interview.title || interview.type,
      difficulty: interview.difficulty,
      isVerified: true,
    });

    res.status(201).json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    console.error('Error creating certificate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create certificate',
      error: error.message,
    });
  }
};
