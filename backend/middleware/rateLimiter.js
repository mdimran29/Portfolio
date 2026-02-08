/**
 * Rate Limiter Middleware
 * Prevents spam and abuse by limiting requests per IP address
 * Production-ready configuration with clear error messages
 */

const rateLimit = require('express-rate-limit');

/**
 * Contact Form Rate Limiter
 * Limits: 3 requests per 15 minutes per IP
 * This prevents spam while allowing legitimate users to retry if needed
 */
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 requests per windowMs
  message: {
    success: false,
    error: 'Too many contact form submissions from this IP. Please try again after 15 minutes.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  
  // Skip rate limiting for successful requests (optional - comment out if you want to limit all requests)
  skipSuccessfulRequests: false,
  
  // Skip rate limiting for failed requests (optional)
  skipFailedRequests: false,
  
  // Custom handler for rate limit exceeded
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many requests. You have exceeded the rate limit.',
      message: 'Please wait 15 minutes before trying again.',
      retryAfter: Math.ceil(req.rateLimit.resetTime.getTime() / 1000)
    });
  }
});

/**
 * General API Rate Limiter (optional - for all other endpoints)
 * Limits: 100 requests per 15 minutes per IP
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  contactLimiter,
  generalLimiter
};
