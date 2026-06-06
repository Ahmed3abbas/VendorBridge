import mailer from '../config/mailer.js';
import { env } from '../config/env.js';

export const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  return mailer.sendMail({
    from: `VendorBridge <${env.FROM_EMAIL}>`,
    to,
    subject,
    html,
    attachments,
  });
};
