import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jasimmushtaq786@gmail.com',
    pass: 'awii cejt ubup lcoq'
  }
});

app.post('/api/send-email', async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  try {
    const htmlTemplate = `
      <div style="font-family: 'Inter', Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #334155;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
          <div style="background: linear-gradient(135deg, #1e3a8a, #0891b2); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">SwasthyaCare Query</h1>
            <p style="color: #bae6fd; margin: 10px 0 0 0; font-size: 16px;">You have a new message from a user</p>
          </div>
          <div style="padding: 40px 30px;">
            <div style="background-color: #f1f5f9; padding: 25px; border-radius: 10px; margin-bottom: 30px; border-left: 4px solid #2563eb;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: 700; color: #475569; width: 80px;">Name</td>
                  <td style="padding: 8px 0; color: #0f172a; font-weight: 500;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 700; color: #475569;">Email</td>
                  <td style="padding: 8px 0; color: #0f172a;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-weight: 500;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 700; color: #475569;">Subject</td>
                  <td style="padding: 8px 0; color: #0f172a; font-weight: 500;">${subject}</td>
                </tr>
              </table>
            </div>
            
            <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-top: 0; margin-bottom: 12px;">Message Details</h3>
            <div style="font-size: 16px; line-height: 1.7; color: #1e293b; white-space: pre-wrap; background-color: #ffffff; border: 1px solid #e2e8f0; padding: 24px; border-radius: 10px;">
              ${message}
            </div>
            
            <div style="margin-top: 40px; text-align: center;">
              <a href="mailto:${email}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.4);">Reply to ${name}</a>
            </div>
          </div>
          <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 13px; color: #94a3b8;">This is an automated message from the SwasthyaCare platform.</p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: '"SwasthyaCare Alerts" <jasimmushtaq786@gmail.com>',
      to: 'jasimmushtaq786@gmail.com', // send to yourself to receive queries
      replyTo: email,
      subject: `New Query: ${subject} - from ${name}`,
      text: `You have received a new message from ${name} (${email}).\n\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: htmlTemplate
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = 3001;
  app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
}

export default app;
