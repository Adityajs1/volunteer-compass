import nodemailer from 'nodemailer';
import { env } from '../config/env';

let transporter: nodemailer.Transporter | null = null;

export const initializeEmailService = async (): Promise<void> => {
  // In production, use configured SMTP credentials (never call Ethereal)
  if (env.isProduction) {
    if (env.smtp.enabled) {
      transporter = nodemailer.createTransport({
        host: env.smtp.host,
        port: env.smtp.port,
        secure: env.smtp.port === 465,
        auth: {
          user: env.smtp.user,
          pass: env.smtp.pass,
        },
      });
      console.log('✅ Nodemailer (SMTP) initialized');
    } else {
      console.warn('⚠️  SMTP not configured — email features will be unavailable');
    }
    return;
  }

  // Development-only: use Ethereal for easy local testing
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('✅ Nodemailer (Ethereal Email) initialized');
  } catch (error) {
    console.warn('⚠️  Ethereal Email unavailable — email features disabled in dev');
  }
};

export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  if (!transporter) {
    console.log(`[Email Service Down] Reset URL would be: http://localhost:5173/reset-password?token=${resetToken}`);
    return;
  }

  const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

  const info = await transporter.sendMail({
    from: '"Volunteer Compass" <no-reply@volunteercompass.app>',
    to: email,
    subject: "Reset Your Password - Volunteer Compass",
    text: `You requested a password reset. Click this link to reset your password: ${resetUrl}`,
    html: `
      <h2>Password Reset</h2>
      <p>You requested a password reset for your Volunteer Compass account.</p>
      <p>Click the link below to securely reset your password:</p>
      <a href="${resetUrl}" style="padding: 10px 20px; background-color: #3d6b4f; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  });

  console.log(`\n📧 Envelope sent to ${email}`);
  console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}\n`);
};
