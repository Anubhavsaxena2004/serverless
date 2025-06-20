const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Serve static files (index.html, etc.)
app.use(express.static(__dirname));
app.use(bodyParser.json());

// Email sending endpoint
app.post('/send-email', async (req, res) => {
  const { receiver_email, subject, body_text } = req.body;
  if (!receiver_email || !subject || !body_text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(receiver_email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: receiver_email,
      subject: subject,
      text: body_text
    };
    const info = await transporter.sendMail(mailOptions);
    res.json({ message: 'Email sent successfully', messageId: info.messageId });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Fallback to index.html for any GET route (for SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
}); 