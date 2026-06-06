import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import mailer from '../config/mailer.js';
import { env } from '../config/env.js';
import logger from '../config/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function sendEmail({ to, subject, templateName, data = {}, html, attachments = [] }) {
  let content = html;
  if (templateName) {
    const templatePath = join(__dirname, '../templates', templateName);
    content = readFileSync(templatePath, 'utf-8');
    for (const [key, value] of Object.entries(data)) {
      content = content.replaceAll(`{{${key}}}`, value ?? '');
    }
  }

  try {
    await mailer.sendMail({ from: env.SMTP_FROM, to, subject, html: content, attachments });
    logger.info(`Email sent to ${to}: ${subject}`);
  } catch (err) {
    logger.error(`Email failed to ${to}: ${err.message}`);
    throw err;
  }
}
