/**
 * Email Configuration Test Script
 * Tests Gmail connection without starting the full server
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('\n🔍 Testing Email Configuration...\n');
console.log('📧 Email User:', process.env.EMAIL_USER);
console.log('🔑 Password Length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);
console.log('📮 Admin Email:', process.env.ADMIN_EMAIL);
console.log('\n' + '='.repeat(60) + '\n');

// Test multiple configurations
async function testConfiguration(config, name) {
  console.log(`🧪 Testing: ${name}`);
  
  try {
    const transporter = nodemailer.createTransport(config);
    await transporter.verify();
    console.log(`✅ ${name} - SUCCESS!\n`);
    return true;
  } catch (error) {
    console.log(`❌ ${name} - FAILED`);
    console.log(`   Error: ${error.message}\n`);
    return false;
  }
}

async function runTests() {
  const configs = [
    {
      name: 'Config 1: Gmail Service (Default)',
      config: {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      }
    },
    {
      name: 'Config 2: Gmail SMTP Port 587 (STARTTLS)',
      config: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      }
    },
    {
      name: 'Config 3: Gmail SMTP Port 465 (SSL)',
      config: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      }
    },
    {
      name: 'Config 4: Gmail SMTP Port 587 with TLS options',
      config: {
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
      }
    }
  ];

  let successCount = 0;
  
  for (const { name, config } of configs) {
    const success = await testConfiguration(config, name);
    if (success) {
      successCount++;
      console.log('🎉 Found working configuration!\n');
      console.log('Use this configuration in emailService.js:');
      console.log(JSON.stringify(config, null, 2));
      console.log('\n');
      break; // Stop after first success
    }
  }

  console.log('='.repeat(60));
  console.log(`\n📊 Results: ${successCount}/${configs.length} configurations worked\n`);
  
  if (successCount === 0) {
    console.log('⚠️  All configurations failed. Please check:');
    console.log('   1. Is 2-Step Verification enabled?');
    console.log('   2. Is the App Password correct?');
    console.log('   3. Try generating a NEW App Password');
    console.log('   4. Check: https://myaccount.google.com/apppasswords\n');
  }
}

runTests().catch(console.error);
