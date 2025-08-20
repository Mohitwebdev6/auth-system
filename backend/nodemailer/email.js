import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config()



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL_USER,
    pass: process.env.NODEMAILER_EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"My App" <${process.env.NODEMAILER_EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.log("Email sending Error:", error.message);
    throw err;
  }
};


