import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "plata.jose13@gmail.com",
    pass: "dswqggrjicnzecyk",
  },
});

transporter.sendMail({
  from: "plata.jose13@gmail.com",
  to: "plata.jose13@gmail.com",
  subject: "Test Email",
  text: "This is a test email from Node.js",
}, (err, info) => {
  if (err) console.error("Error:", err);
  else console.log("Email sent:", info.response);
});