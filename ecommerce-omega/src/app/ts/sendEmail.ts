import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

type Data = {
  success: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const { name, email, pn, subject, message } = req.body;
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    try {
      await transporter.sendMail({
        from: `"${name}" <${email}>`,
        to: 'aspasoftwaredevelopment@gmail.com',
        subject: subject,
        text: `Phone Number: ${pn}\n\n${message}`,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error sending email' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
