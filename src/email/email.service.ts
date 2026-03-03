import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { env } from 'src/config/env';
import { passwordResetTemplate } from './templates/passwordReset.template';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: parseInt(env.SMTP_PORT, 10),
    secure: false, // true for 465, false for other ports
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  });

  async sendEmail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: env.SMTP_USER,
      to,
      subject,
      html,
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string) {
    const resetLink = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const html = passwordResetTemplate(to, resetLink);

    await this.sendEmail(to, 'Redefinição de Senha', html);
  }
}
