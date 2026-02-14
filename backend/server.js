/**
 * Portfolio Backend Server
 * Production-ready Express server for contact form handling
 * 
 * Features:
 * - Contact form with email notifications
 * - Rate limiting for spam protection
 * - Input validation
 * - CORS support
 * - Security headers
 * - Error handling
 * - Logging
 * 
 * @author Md Imran
 * @version 1.0.0
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { generalLimiter } = require('./middleware/rateLimiter');
const contactRoutes = require('./routes/contact');

// Initialize Express app
const app = express();

// Environment configuration
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

/**
 * ============================================================================
 * MIDDLEWARE CONFIGURATION
 * ============================================================================
 */

// Security headers with Helmet
app.use(helmet({
  contentSecurityPolicy: false, // Disable if you're sending HTML emails
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
// Allows requests from your frontend
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is from Vercel (matches *.vercel.app)
    const isVercelDomain = origin && (
      origin.endsWith('.vercel.app') || 
      origin === 'https://mdimran-portfolio.vercel.app'
    );
    
    // Allowed origins
    const allowedOrigins = [
      FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:3001',
    ];
    
    if (allowedOrigins.includes(origin) || isVercelDomain) {
      callback(null, true);
    } else {
      console.log('⚠️ CORS Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
// 'combined' format provides detailed logs
// Use 'dev' for development (shorter logs)
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// General rate limiter for all routes
app.use('/api', generalLimiter);

/**
 * ============================================================================
 * ROUTES
 * ============================================================================
 */

// Health check endpoint (no rate limiting)
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Portfolio backend is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    version: '1.0.0',
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Portfolio Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      contact: 'POST /api/contact',
      contactHealth: 'GET /api/contact/health'
    },
    documentation: 'https://github.com/mdimran29/Portfolio'
  });
});

// Contact form routes
app.use('/api', contactRoutes);

/**
 * ============================================================================
 * ERROR HANDLING
 * ============================================================================
 */

// 404 handler - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.url}`,
    availableRoutes: {
      health: 'GET /health',
      contact: 'POST /api/contact',
      contactHealth: 'GET /api/contact/health'
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method
  });

  // Handle CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      error: 'CORS Error',
      message: 'Your origin is not allowed to access this resource'
    });
  }

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON',
      message: 'The request body contains invalid JSON'
    });
  }

  // Generic error response
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    message: NODE_ENV === 'development' 
      ? err.stack 
      : 'An unexpected error occurred. Please try again later.'
  });
});

/**
 * ============================================================================
 * SERVER STARTUP
 * ============================================================================
 */

// Verify email configuration on startup
const { verifyTransporter } = require('./services/emailService');

const startServer = async () => {
  try {
    // Verify email configuration
    console.log('\n🔍 Verifying email configuration...');
    const isEmailValid = await verifyTransporter();
    
    if (!isEmailValid) {
      console.warn('⚠️  WARNING: Email configuration is invalid!');
      console.warn('⚠️  Contact form will not work properly.');
      console.warn('⚠️  Please check your .env file and ensure EMAIL_USER and EMAIL_PASS are set correctly.');
    }

    // Start the server
    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(60));
      console.log('🚀 Portfolio Backend Server Started Successfully!');
      console.log('='.repeat(60));
      console.log(`📍 Server URL: http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
      console.log(`📧 Email Service: ${isEmailValid ? '✅ Ready' : '❌ Not configured'}`);
      console.log(`🔒 CORS Allowed: ${FRONTEND_URL}`);
      console.log('='.repeat(60));
      console.log('\n📝 Available Endpoints:');
      console.log(`   GET  /health                  - Health check`);
      console.log(`   GET  /api/contact/health      - Contact service health`);
      console.log(`   POST /api/contact             - Submit contact form`);
      if (NODE_ENV !== 'production') {
        console.log(`   GET  /api/contact/test        - Test email config (dev only)`);
      }
      console.log('\n' + '='.repeat(60) + '\n');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;
