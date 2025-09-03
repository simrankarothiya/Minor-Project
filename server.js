const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 5000;
app.use(bodyParser.json());
app.use(cors());
let otpStore = {};
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yourgmail@gmail.com", 
    pass: "your-app-password"    
  }
});

app.post("/send-otp", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email required" });
  }
  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore[email] = otp;
  let mailOptions = {
    from: "yourgmail@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "Error sending OTP" });
    } else {
      console.log("OTP sent: " + info.response);
      return res.json({ success: true, message: "OTP sent to email" });
    }
  });
});
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] && otpStore[email] == otp) {
    // OTP sahi hai
    delete otpStore[email]; // OTP ek hi bar kaam karega
    return res.json({ success: true, message: "OTP verified" });
  } else {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
