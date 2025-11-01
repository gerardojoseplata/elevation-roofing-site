const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Serve static files (your HTML, CSS)
app.use(express.static(__dirname));

// Parse form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Contact form endpoint
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    const msg = {
        to: process.env.FROM_EMAIL,       // where your emails will go
        from: process.env.FROM_EMAIL,     // email sender
        subject: `New message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `<p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong> ${message}</p>`
    };

    try {
        await sgMail.send(msg);
        res.status(200).send('Message sent successfully!');
    } catch (error) {
        console.error('SendGrid error:', error);
        res.status(500).send('Error sending message.');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});