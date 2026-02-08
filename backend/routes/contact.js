/**
 * Contact Form Routes
 * Handles all contact form submissions with validation and security
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { contactLimiter } = require('../middleware/rateLimiter');
const { sendAdminNotification, sendAutoReply } = require('../services/emailService');

const router = express.Router();

/**
 * Validation rules for contact form
 * Ensures all required fields are present and valid
 */
const validateContactForm = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ min: 3, max: 200 }).withMessage('Subject must be between 3 and 200 characters'),
  
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5000 characters'),
  
  // Optional: Honeypot field check (spam protection)
  // If this field is filled, it's likely a bot
  body('website')
    .optional()
    .custom((value) => {
      if (value && value.length > 0) {
        throw new Error('Spam detected');
      }
      return true;
    })
];

/**
 * POST /api/contact
 * Main contact form endpoint
 * 
 * Request Body:
 * {
 *   name: string,
 *   email: string,
 *   subject: string,
 *   message: string,
 *   website?: string (honeypot field)
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   message: string
 * }
 */
router.post(
  '/contact',
  contactLimiter,          // Apply rate limiting
  validateContactForm,     // Validate input
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array().map(err => ({
            field: err.path,
            message: err.msg
          }))
        });
      }

      // Extract form data
      const { name, email, subject, message } = req.body;
      
      // Prepare data for emails
      const formData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim()
      };

      // Log the contact attempt (for monitoring)
      console.log('📧 New contact form submission:', {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        timestamp: new Date().toISOString(),
        ip: req.ip || req.connection.remoteAddress
      });

      // Send emails in parallel for better performance
      const emailPromises = [
        sendAdminNotification(formData),
        sendAutoReply(formData)
      ];

      // Wait for both emails to be sent
      await Promise.all(emailPromises);

      // Success response
      res.status(200).json({
        success: true,
        message: 'Thank you for your message! We\'ll get back to you soon.',
        data: {
          name: formData.name,
          email: formData.email
        }
      });

    } catch (error) {
      // Log the error for debugging
      console.error('❌ Error processing contact form:', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });

      // Return user-friendly error
      res.status(500).json({
        success: false,
        error: 'Failed to send message',
        message: 'We encountered an error while processing your request. Please try again later or contact us directly at dev.mdimran@gmail.com'
      });
    }
  }
);

/**
 * GET /api/contact/health
 * Health check endpoint to verify the contact service is working
 */
router.get('/contact/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Contact service is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

/**
 * GET /api/contact/test
 * Test endpoint to verify email configuration (only in development)
 */
router.get('/contact/test', async (req, res) => {
  // Only allow in development mode
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      error: 'Test endpoint is disabled in production'
    });
  }

  try {
    const { verifyTransporter } = require('../services/emailService');
    const isValid = await verifyTransporter();
    
    res.status(200).json({
      success: isValid,
      message: isValid 
        ? 'Email configuration is valid' 
        : 'Email configuration failed. Check your credentials.',
      config: {
        emailUser: process.env.EMAIL_USER ? 'Set' : 'Not set',
        emailPass: process.env.EMAIL_PASS ? 'Set' : 'Not set',
        adminEmail: process.env.ADMIN_EMAIL || 'dev.mdimran@gmail.com'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
