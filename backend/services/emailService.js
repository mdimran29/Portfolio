/**
 * Email Service using Nodemailer
 * Handles sending emails to admin and auto-reply to users
 * Uses Gmail SMTP with App Password authentication
 */

const nodemailer = require('nodemailer');

/**
 * Create reusable transporter object using Gmail SMTP
 */
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('EMAIL_USER and EMAIL_PASS must be set in environment variables');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

/**
 * Send notification email to admin
 */
const sendAdminNotification = async (formData) => {
  const { name, email, subject, message } = formData;
  
  const transporter = createTransporter();
  
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 20px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:650px;margin:0 auto;background:#ffffff;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
    <tr>
      <td style="background:linear-gradient(135deg,#00d9ff 0%,#0080ff 50%,#667eea 100%);padding:50px 40px;text-align:center;">
        <div style="font-size:64px;margin-bottom:15px;">📬</div>
        <h1 style="color:#ffffff;font-size:32px;font-weight:700;margin:0 0 8px 0;">New Portfolio Message</h1>
        <p style="color:rgba(255,255,255,0.95);font-size:16px;margin:0;">Someone wants to connect with you!</p>
      </td>
    </tr>
    <tr>
      <td style="padding:40px;">
        <div style="display:inline-block;background:linear-gradient(135deg,#00d9ff,#0080ff);color:white;padding:8px 20px;border-radius:20px;font-size:13px;font-weight:600;margin-bottom:25px;text-transform:uppercase;">⚡ New Contact Request</div>
        
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#f8f9ff 0%,#f0f4ff 100%);border-radius:12px;padding:25px;margin:25px 0;border:1px solid #e0e7ff;border-left:4px solid #00d9ff;">
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid rgba(102,126,234,0.1);">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="50" valign="top">
                    <div style="width:40px;height:40px;background:linear-gradient(135deg,#00d9ff,#667eea);border-radius:10px;text-align:center;line-height:40px;font-size:20px;">👤</div>
                  </td>
                  <td valign="top">
                    <div style="font-weight:600;color:#667eea;font-size:13px;text-transform:uppercase;margin-bottom:4px;">Name</div>
                    <div style="color:#2d3748;font-size:16px;">${name}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid rgba(102,126,234,0.1);">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="50" valign="top">
                    <div style="width:40px;height:40px;background:linear-gradient(135deg,#00d9ff,#667eea);border-radius:10px;text-align:center;line-height:40px;font-size:20px;">📧</div>
                  </td>
                  <td valign="top">
                    <div style="font-weight:600;color:#667eea;font-size:13px;text-transform:uppercase;margin-bottom:4px;">Email</div>
                    <div style="color:#2d3748;font-size:16px;"><a href="mailto:${email}" style="color:#0080ff;text-decoration:none;">${email}</a></div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="50" valign="top">
                    <div style="width:40px;height:40px;background:linear-gradient(135deg,#00d9ff,#667eea);border-radius:10px;text-align:center;line-height:40px;font-size:20px;">📋</div>
                  </td>
                  <td valign="top">
                    <div style="font-weight:600;color:#667eea;font-size:13px;text-transform:uppercase;margin-bottom:4px;">Subject</div>
                    <div style="color:#2d3748;font-size:16px;">${subject}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <div style="height:1px;background:linear-gradient(90deg,transparent,#e2e8f0,transparent);margin:30px 0;"></div>
        
        <div style="margin:30px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:15px;">
            <tr>
              <td width="50" valign="middle">
                <div style="width:40px;height:40px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:10px;text-align:center;line-height:40px;font-size:20px;">💬</div>
              </td>
              <td valign="middle">
                <div style="color:#2d3748;font-size:18px;font-weight:700;">Message</div>
              </td>
            </tr>
          </table>
          <div style="background:#ffffff;border:2px solid #e0e7ff;border-radius:12px;padding:25px;color:#2d3748;font-size:15px;line-height:1.7;white-space:pre-wrap;word-wrap:break-word;">${message}</div>
        </div>
        
        <div style="text-align:center;margin:35px 0;">
          <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" style="display:inline-block;background:linear-gradient(135deg,#00d9ff 0%,#0080ff 100%);color:white;padding:16px 40px;text-decoration:none;border-radius:12px;font-weight:600;font-size:16px;">↩️ Reply to ${name}</a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="background:#f7fafc;padding:30px 40px;border-top:1px solid #e2e8f0;text-align:center;">
        <div style="background:white;border:1px solid #e2e8f0;border-radius:8px;padding:12px 20px;display:inline-block;margin-bottom:15px;color:#4a5568;font-size:14px;">
          <strong style="color:#667eea;">📅 Received:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' })}
        </div>
        <div style="color:#718096;font-size:13px;">Portfolio Backend v1.0</div>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const mailOptions = {
    from: {
      name: 'Portfolio Contact Form',
      address: process.env.EMAIL_USER
    },
    to: process.env.ADMIN_EMAIL || 'dev.mdimran@gmail.com',
    replyTo: email,
    subject: `🔔 New Portfolio Message – ${subject}`,
    text: `
You have received a new message from your portfolio contact form.

CONTACT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${name}
Email: ${email}
Subject: ${subject}

MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To reply: ${email}
Timestamp: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}
    `.trim(),
    html: htmlContent.trim()
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Admin notification sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending admin notification:', error);
    throw error;
  }
};

/**
 * Send auto-reply email to user
 */
const sendAutoReply = async (formData) => {
  const { name, email } = formData;
  
  const transporter = createTransporter();
  
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:linear-gradient(135deg,#00d9ff 0%,#667eea 100%);padding:40px 20px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
    <tr>
      <td style="background:linear-gradient(135deg,#00d9ff 0%,#0080ff 50%,#667eea 100%);padding:60px 40px;text-align:center;">
        <div style="font-size:80px;margin-bottom:20px;">👋</div>
        <h1 style="color:#ffffff;font-size:36px;font-weight:700;margin:0 0 10px 0;">Thank You!</h1>
        <p style="color:rgba(255,255,255,0.95);font-size:18px;margin:0;font-weight:500;">Your message has been received</p>
      </td>
    </tr>
    <tr>
      <td style="padding:45px 40px;">
        <div style="font-size:24px;font-weight:700;color:#2d3748;margin-bottom:20px;">Hi <span style="background:linear-gradient(135deg,#00d9ff,#667eea);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${name}</span>,</div>
        
        <p style="color:#4a5568;font-size:16px;line-height:1.8;margin-bottom:20px;">Thank you for reaching out through my portfolio! I've received your message and I'm excited to connect with you.</p>
        
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#f8f9ff 0%,#f0f4ff 100%);border-left:4px solid #00d9ff;border-radius:12px;padding:25px;margin:30px 0;">
          <tr>
            <td>
              <div style="font-size:32px;margin-bottom:10px;">⏱️</div>
              <h3 style="color:#667eea;font-size:18px;font-weight:700;margin:0 0 10px 0;">What Happens Next?</h3>
              <p style="color:#4a5568;font-size:15px;line-height:1.6;margin:0;">I'll review your message carefully and get back to you <strong style="color:#00d9ff;">within 24 hours</strong>. I appreciate your patience!</p>
            </td>
          </tr>
        </table>
        
        <p style="color:#4a5568;font-size:16px;line-height:1.8;margin-bottom:20px;">In the meantime, feel free to connect with me:</p>
        
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:35px 0;">
          <tr>
            <td align="center">
              <div style="color:#2d3748;font-size:18px;font-weight:700;margin-bottom:20px;">Connect with Me</div>
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:5px;">
                    <a href="https://github.com/mdimran29" style="display:inline-block;background:white;border:2px solid #667eea;color:#667eea;padding:14px 28px;text-decoration:none;border-radius:12px;font-weight:600;font-size:15px;">🔗 GitHub</a>
                  </td>
                  <td style="padding:5px;">
                    <a href="https://www.linkedin.com/in/mdimran29" style="display:inline-block;background:white;border:2px solid #667eea;color:#667eea;padding:14px 28px;text-decoration:none;border-radius:12px;font-weight:600;font-size:15px;">💼 LinkedIn</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <div style="height:2px;background:linear-gradient(90deg,transparent,#e2e8f0,transparent);margin:35px 0;"></div>
        
        <div style="margin-top:35px;padding-top:25px;border-top:2px solid #f0f4ff;">
          <div style="color:#4a5568;font-size:15px;margin-bottom:15px;">Looking forward to chatting with you!</div>
          <div style="font-size:24px;font-weight:700;background:linear-gradient(135deg,#00d9ff,#667eea);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:5px;">Md Imran</div>
          <div style="color:#718096;font-size:14px;font-weight:500;font-style:italic;">Blockchain Engineer | Full Stack Developer</div>
        </div>
      </td>
    </tr>
    <tr>
      <td style="background:linear-gradient(135deg,#f7fafc 0%,#f0f4ff 100%);padding:30px 40px;border-top:1px solid #e2e8f0;text-align:center;">
        <div style="display:inline-block;background:linear-gradient(135deg,#00d9ff,#667eea);color:white;padding:8px 20px;border-radius:20px;font-size:12px;font-weight:600;margin-bottom:15px;text-transform:uppercase;">✅ Automated Response</div>
        <div style="color:#718096;font-size:13px;line-height:1.6;">This is an automated response<br><strong>Portfolio Backend v1.0</strong></div>
        <div style="color:#e53e3e;font-size:12px;margin-top:10px;font-weight:500;">⚠️ Please do not reply to this email</div>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const mailOptions = {
    from: {
      name: 'Md Imran',
      address: process.env.EMAIL_USER
    },
    to: email,
    subject: `Thanks for reaching out, ${name}! 👋`,
    text: `
Hi ${name},

Thank you for reaching out through my portfolio! I've received your message and I'm excited to connect with you.

I'll review your message carefully and get back to you within 24 hours. I appreciate your patience!

In the meantime, feel free to connect with me on:
🔗 GitHub: https://github.com/mdimran29
💼 LinkedIn: https://www.linkedin.com/in/mdimran29

Looking forward to our conversation!

Best regards,
Md Imran
Blockchain Engineer | Full Stack Developer

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated response.
Please do not reply to this email directly.
    `.trim(),
    html: htmlContent.trim()
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Auto-reply sent to user:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending auto-reply:', error);
    throw error;
  }
};

/**
 * Verify email transporter configuration
 */
const verifyTransporter = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email transporter is ready to send emails');
    return true;
  } catch (error) {
    console.error('❌ Email transporter verification failed:', error.message);
    return false;
  }
};

module.exports = {
  sendAdminNotification,
  sendAutoReply,
  verifyTransporter
};
                    