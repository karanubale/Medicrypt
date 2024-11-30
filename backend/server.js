import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/authRoute.js";
import nodemailer from 'nodemailer';
import multer from 'multer';

dotenv.config();  

connectDB();


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

const upload = multer();


const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});


app.post('/send-email', upload.single('file'), (req, res) => {
  const { email } = req.body;
  const file = req.file;

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: 'Prescription File',
    text: 'Please find the attached prescription file.',
    attachments: [
      {
        filename: 'prescription.docx',
        content: file.buffer,
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending email');
    }
    res.status(200).send('Email sent successfully');
  });
});


app.use("/api/v1/auth", authRoutes);

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`);
});
