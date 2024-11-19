const nodeMailer = require('nodemailer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'resetpassword.html');
const emailTemplate = fs.readFileSync(templatePath, 'utf-8');

function customizeTemplate(template, replacements) {
  return template.replace(/{{(\w+)}}/g, (match, key) => replacements[key] || match);
}

async function sendEmail(email) {
  let otp = crypto.randomInt(100000, 999999);
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your SMTP service
    auth: {
        user: 'antrikshrawat2@gmail.com',
        pass: 'crbt qanm enyw ksxi'
    }
});
   
const customizedTemplate = customizeTemplate(emailTemplate, { otp });
  const mailOptions = {
    from: "antrikshrawat2@gmail.com",
    to: `${email}`,
    subject: "Verification Email",
    html: customizedTemplate,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP Email Sent');
} catch (error) {
    console.error('Error Sending Email');
}
}

module.exports = sendEmail;
