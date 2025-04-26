const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  service: "Gmail", 
  auth: {
    user: process.env.MY_USER, // Your email address
    pass: process.env.EMAIL_PASS, // App password or email password
  },
});


const sendMailForVerification = async (name, otp, toEmail) => {
  try {
    const info = await transporter.sendMail({
        from: `"Mridul's Website" <${process.env.MY_USER}>`,
        to: toEmail,
        subject: "Verify Your Email ✔",
        html: `
          <div style="max-width: 600px; margin: auto; padding: 20px; background: #ffffff; border: 1px solid #eaeaea; border-radius: 10px; font-family: 'Arial', sans-serif; color: #333;">
            <div style="text-align: center; padding-bottom: 20px;">
              <h1 style="color: #2563EB; margin: 0;">Welcome to Mridul's Website</h1>
              <p style="font-size: 16px;">We’re excited to have you on board!</p>
            </div>
            <div>
              <h2 style="color: #111;">Hello ${name},</h2>
              <p style="font-size: 15px;">Thank you for signing up. Please use the following OTP to verify your email address:</p>
              <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; background-color: #2563EB; color: #fff; padding: 15px 30px; font-size: 24px; border-radius: 8px; letter-spacing: 4px;">
                  ${otp}
                </span>
              </div>
              <p style="font-size: 14px; color: #666;">This OTP is valid for the next <strong>10 minutes</strong>.</p>
              <p style="font-size: 14px; color: #666;">If you didn’t request this email, you can safely ignore it.</p>
              <br>
              <p style="font-size: 14px;">Best regards,</p>
              <p style="font-size: 16px; font-weight: bold;">Mridul Singh Saklani</p>
            </div>
            <hr style="margin: 30px 0;">
            <div style="text-align: center; font-size: 12px; color: #aaa;">
              <p>&copy; ${new Date().getFullYear()} Mridul's Website. All rights reserved.</p>
            </div>
          </div>
        `,
      });
      

    console.log("Verification email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Email sending failed.");
  }
};

module.exports = sendMailForVerification;
