require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Configure the Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail
    pass: process.env.EMAIL_PASS, // Your App Password
  },
});

app.post('/api/send-email-otp', async (req, res) => {
  const { email, otpCode } = req.body;

  const mailOptions = {
    from: `"Vyapar AI Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your Verification Code: ${otpCode}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; background-color: #0f172a; color: white; border-radius: 10px;">
        <h1 style="color: #10b981;">Vyapar.ai</h1>
        <p>Use the code below to verify your business identity:</p>
        <h2 style="letter-spacing: 5px; font-size: 32px; color: #10b981;">${otpCode}</h2>
        <p style="color: #64748b; font-size: 12px;">This code expires in 10 minutes.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));