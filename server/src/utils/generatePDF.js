import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function generatePDF(templateName, data) {
  const templatePath = join(__dirname, '../templates', templateName);
  let html = readFileSync(templatePath, 'utf-8');

  // Replace {{key}} placeholders with data values
  for (const [key, value] of Object.entries(data)) {
    html = html.replaceAll(`{{${key}}}`, value ?? '');
  }

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();
  return pdf;
}
