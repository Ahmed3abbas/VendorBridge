import puppeteer from 'puppeteer';
import { readFile } from 'fs/promises';

export const generatePDF = async (templatePath, data) => {
  let html = await readFile(templatePath, 'utf-8');

  Object.entries(data).forEach(([key, value]) => {
    html = html.replaceAll(`{{${key}}}`, value ?? '');
  });

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const buffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();

  return buffer;
};
