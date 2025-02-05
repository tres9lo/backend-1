const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bikotreslo.99@gmail.com', // Replace with your Gmail address
    pass: 'mewc pphl hrxm trnp',   // Replace with the App Password generated
  },
});

// Function to send email
const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: 'bikotresor45@gmail.com',
      to: to,
      subject: subject,
      text: text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Example usage
sendEmail('bikotresor45@gmail.com', 'Test Subject', 'Hello, this is a test email.');
