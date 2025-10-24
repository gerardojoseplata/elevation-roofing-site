// server.js — overwrite existing file with this exact content
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import sgMail from "@sendgrid/mail";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// quick debug logs on startup (safe)
console.log("STARTUP: checking env vars...");
console.log("SENDGRID_API_KEY set:", !!process.env.SENDGRID_API_KEY);
console.log("EMAIL_TO:", !!process.env.EMAIL_TO);
console.log("EMAIL_FROM:", !!process.env.EMAIL_FROM);

if (!process.env.SENDGRID_API_KEY) {
  console.error("❌ Missing SENDGRID_API_KEY env var");
}
if (!process.env.EMAIL_TO) {
  console.error("❌ Missing EMAIL_TO env var");
}
if (!process.env.EMAIL_FROM) {
  console.error("❌ Missing EMAIL_FROM env var");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// main endpoint used by the form and curl tests
app.post("/send", async (req, res) => {
  try {
    const { name = "No name", email = "no-reply@example.com", message = "" } = req.body ?? {};

    const msg = {
      to: process.env.EMAIL_TO,
      from: process.env.EMAIL_FROM, // must be SendGrid-verified
      subject: `Website message from ${name}`,
      text: `From: ${email}\n\n${message}`,
    };

    await sgMail.send(msg);
    console.log("✅ SendGrid: message sent");
    return res.status(200).json({ ok: true, message: "Message sent" });
  } catch (err) {
    console.error("❌ Error sending email:", err);
    if (err?.response?.body) console.error("SendGrid response body:", JSON.stringify(err.response.body));
    return res.status(500).json({ ok: false, error: err?.message || err });
  }
});

// debug/test endpoints
app.get("/env-debug", (req, res) => {
  return res.json({
    SENDGRID_API_KEY_set: !!process.env.SENDGRID_API_KEY,
    EMAIL_TO: !!process.env.EMAIL_TO,
    EMAIL_FROM: !!process.env.EMAIL_FROM,
  });
});

app.get("/test-sendgrid", async (req, res) => {
  try {
    const msg = {
      to: process.env.EMAIL_TO,
      from: process.env.EMAIL_FROM,
      subject: "SendGrid test from server",
      text: "This is a SendGrid test.",
    };
    await sgMail.send(msg);
    return res.status(200).send("✅ Test email sent. Check SendGrid activity and inbox.");
  } catch (err) {
    console.error("❌ /test-sendgrid error:", err);
    if (err?.response?.body) console.error("SendGrid response body:", err.response.body);
    return res.status(500).send("❌ Test failed: " + (err.message || "unknown error"));
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));