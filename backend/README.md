# Portfolio Backend

Production-ready Node.js backend for portfolio contact form with email notifications.

## 🚀 Features

- ✅ RESTful API with Express.js
- ✅ Contact form handling with validation
- ✅ Email notifications (Admin + Auto-reply)
- ✅ Rate limiting (spam protection)
- ✅ Input sanitization & validation
- ✅ CORS support
- ✅ Security headers (Helmet)
- ✅ Error handling & logging
- ✅ Honeypot field (anti-bot)
- ✅ Production-ready with health checks

## 📋 Prerequisites

- Node.js >= 16.0.0
- Gmail account with App Password
- npm or yarn

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file with your credentials:**
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ADMIN_EMAIL=dev.mdimran@gmail.com
   ```

## 🔑 Gmail App Password Setup

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not already enabled)
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select **Mail** and **Other (Custom name)**
5. Generate and copy the 16-character password
6. Paste it in `.env` as `EMAIL_PASS` (remove spaces)

## 🏃‍♂️ Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

Server will start on: `http://localhost:5000`

## 📡 API Endpoints

### Health Check
```http
GET /health
```
Returns server status and uptime.

### Contact Form
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "Hello, I'd like to discuss a project..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Thank you for your message! We'll get back to you soon.",
  "data": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

**Rate Limit Error (429):**
```json
{
  "success": false,
  "error": "Too many requests",
  "message": "Please wait 15 minutes before trying again."
}
```

### Test Email Configuration (Development Only)
```http
GET /api/contact/test
```
Verifies email credentials are working.

## 🔒 Security Features

### Rate Limiting
- **Contact Form:** 3 requests per 15 minutes per IP
- **General API:** 100 requests per 15 minutes per IP

### Input Validation
- Name: 2-100 characters, letters only
- Email: Valid email format
- Subject: 3-200 characters
- Message: 10-5000 characters

### Spam Protection
- Rate limiting
- Honeypot field (optional `website` field)
- Email validation
- Input sanitization

### Security Headers
- Helmet.js for security headers
- CORS with origin whitelist
- JSON body size limit (10MB)

## 📧 Email Templates

### Admin Notification
Beautiful HTML email with:
- Contact details (name, email, subject)
- Message content
- Reply button
- Timestamp

### Auto-Reply to User
Professional auto-reply with:
- Personalized greeting
- Response time expectation (24 hours)
- Social media links (GitHub, LinkedIn)
- Signature with contact info

## 🗂️ Project Structure

```
backend/
├── server.js                 # Main Express server
├── package.json              # Dependencies
├── .env.example              # Environment variables template
├── .env                      # Your actual credentials (DO NOT COMMIT)
├── routes/
│   └── contact.js           # Contact form routes
├── services/
│   └── emailService.js      # Nodemailer configuration
└── middleware/
    └── rateLimiter.js       # Rate limiting logic
```

## 🧪 Testing

### Test email configuration:
```bash
curl http://localhost:5000/api/contact/test
```

### Test contact form:
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Message",
    "message": "This is a test message from the API."
  }'
```

## 🌐 Deployment

### Deploy to Render.com

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables:
   - `PORT` (automatically set by Render)
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-frontend.vercel.app`
   - `EMAIL_USER=your-email@gmail.com`
   - `EMAIL_PASS=your-app-password`
   - `ADMIN_EMAIL=dev.mdimran@gmail.com`

### Deploy to Railway.app

1. Create new project on [Railway](https://railway.app)
2. Connect GitHub repository
3. Add environment variables (same as above)
4. Railway will auto-detect Node.js and deploy

### Deploy to VPS (Ubuntu)

1. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone and setup:**
   ```bash
   git clone https://github.com/mdimran29/Portfolio.git
   cd Portfolio/backend
   npm install
   ```

3. **Configure environment:**
   ```bash
   nano .env
   # Add your credentials
   ```

4. **Use PM2 for process management:**
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name portfolio-backend
   pm2 save
   pm2 startup
   ```

5. **Setup Nginx reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔧 Troubleshooting

### Email not sending?
- Verify Gmail App Password is correct (16 characters, no spaces)
- Check 2-Step Verification is enabled
- Try the test endpoint: `GET /api/contact/test`
- Check server logs for error messages

### CORS errors?
- Add your frontend URL to `FRONTEND_URL` in `.env`
- Update allowed origins in `server.js` corsOptions

### Rate limit too strict?
- Adjust limits in `middleware/rateLimiter.js`
- Default: 3 requests per 15 minutes

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment | No | development |
| `FRONTEND_URL` | Frontend URL for CORS | Yes | - |
| `EMAIL_USER` | Gmail address | Yes | - |
| `EMAIL_PASS` | Gmail App Password | Yes | - |
| `ADMIN_EMAIL` | Your email for notifications | Yes | dev.mdimran@gmail.com |

## 📄 License

MIT License - feel free to use this in your own projects!

## 👨‍💻 Author

**Md Imran**
- GitHub: [@mdimran29](https://github.com/mdimran29)
- LinkedIn: [mdimran29](https://www.linkedin.com/in/mdimran29)
- Email: dev.mdimran@gmail.com

## 🤝 Support

If you have any questions or need help, feel free to:
- Open an issue on GitHub
- Contact me via email
- Connect on LinkedIn

---

**Note:** Make sure to never commit your `.env` file or expose your Gmail App Password!
