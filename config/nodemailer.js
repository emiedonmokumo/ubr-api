import pkg from 'nodemailer';
const { createTransport, Transporter } = pkg;
// import { createTransport, Transporter } from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config()

const ADMIN_MAIL = process.env.ADMIN_MAIL;
const MAIL_HOST = process.env.MAIL_HOST;
const MAIL_PASS = process.env.MAIL_PASS;

// Create a transporter using Gmail
const transporter = createTransport({
  host: MAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: ADMIN_MAIL,
    pass: MAIL_PASS,
  },
  // logger: true,
  debug: true,
});

// Verify connection configuration
const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log('Nodemailer is Ready');
  } catch (error) {
    console.error('Nodemailer connection error:', error);
  }
};

verifyTransporter();

export default transporter;
