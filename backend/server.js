const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();  // Load environment variables

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Create a transporter using Gmail's SMTP server
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bd017610@gmail.com',  // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password (stored in .env)
  },
});

// Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// RSVP Route (Handles POST requests to /api/rsvp)
app.post('/api/rsvp', async (req, res) => {
  const { email, eventName } = req.body;  // We only expect email and eventName

  try {
    // Nodemailer email sending logic
    const mailOptions = {
      from: 'ronimikhaylov02@gmail.com',
      to: email,  // Recipient's email
      subject: `RSVP Confirmation for ${eventName}`,  // Email Subject
      text: `Thank you for RSVPing for the event: ${eventName}. We look forward to seeing you there!`,
      html: `<p>Thank you for RSVPing for the event: <strong>${eventName}</strong>. We look forward to seeing you there!</p>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'RSVP email sent!' });  // Email sent successfully
  } catch (err) {
    console.error('Error occurred:', err);
    res.status(500).json({ error: 'Failed to send RSVP email.' });  // Error handling
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
