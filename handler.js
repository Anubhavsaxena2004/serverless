const nodemailer = require('nodemailer');

const createTransporter = () => {
  console.log('Creating email transporter with service:', process.env.EMAIL_SERVICE);
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

const validateInput = (receiver_email, subject, body_text) => {
  console.log('Validating input:', { receiver_email, subject, body_text });
  
  if (!receiver_email || !subject || !body_text) {
    throw new Error('Missing required fields');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(receiver_email)) {
    throw new Error('Invalid email format');
  }
};

module.exports.sendEmail = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  
  try {
    if (!event.body) {
      throw new Error('Request body is missing');
    }

    const { receiver_email, subject, body_text } = JSON.parse(event.body);
    
    // Validate input
    validateInput(receiver_email, subject, body_text);
    
    // Create transporter
    const transporter = createTransporter();
    
    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: receiver_email,
      subject: subject,
      text: body_text
    };
    
    console.log('Sending email with options:', mailOptions);
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Email sent successfully',
        messageId: info.messageId
      })
    };
    
  } catch (error) {
    console.error('Error sending email:', error);
    
    const statusCode = error.message.includes('Missing required fields') || 
                      error.message.includes('Invalid email format') ? 400 : 500;
    
    return {
      statusCode: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: error.message || 'Internal server error'
      })
    };
  }
}; 