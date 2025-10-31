require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname)); // serve HTML files

app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    const msg = {
        to: process.env.TO_EMAIL,
        from: process.env.TO_EMAIL, // can use same email
        subject: `New Contact from ${name}`,
        text: `Email: ${email}\nMessage: ${message}`
    };

    sgMail
        .send(msg)
        .then(() => res.send('Message sent successfully!'))
        .catch(err => {
            console.error(err);
            res.send('Error sending message.');
        });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));