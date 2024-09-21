const nodeMailer = require('nodemailer');
const crypto = require('crypto');

async function sendEmail(email) {
  let otp = crypto.randomInt(100000, 999999);
  const emailProvider = nodeMailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: "antrikshrawat2@gmail.com",
      pass: "crbt qanm enyw ksxi",
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  const receiver = {
    from: "antrikshrawat2@gmail.com",
    to: `${email}`,
    subject: "Verification Email",
    html: `<h3>Your OTP is ${otp}</h3>`,
  };

  try {
    const response = await emailProvider.sendMail(receiver);
    return { success: true, response, otp };
  } catch (error) {
    return { success: false, error };
  }
}

module.exports = sendEmail;
