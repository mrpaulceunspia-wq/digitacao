/* ARQUIVO: backend/src/pdf/render/renderPdf.js
 * RESPONSAVEL POR: Renderizar HTML e gerar PDF
 * DEPENDENCIAS: fs, path, puppeteer
 */

import fs from 'node:fs';
import path from 'node:path';

import puppeteer from 'puppeteer';

const PDF_ROOT = path.resolve(process.cwd(), 'src', 'pdf');

function loadFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

export function renderHtml({ template = 'relatorio', preset = 'normal' }) {
  const templatePath = path.join(PDF_ROOT, 'templates', `${template}.html`);
  const tokens = loadFile(path.join(PDF_ROOT, 'styles', 'tokens.css'));
  const base = loadFile(path.join(PDF_ROOT, 'styles', 'base.css'));
  const presets = loadFile(path.join(PDF_ROOT, 'styles', 'presets.css'));

  const styles = `<style>\n${tokens}\n${base}\n${presets}\n</style>`;
  const html = loadFile(templatePath);

  return html.replace('{{styles}}', styles).replace('{{preset}}', preset);
}

export async function renderPdf({ html }) {
  const browser = await puppeteer.launch({ headless: 'new' });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    return await page.pdf({ format: 'A4', printBackground: true });
  } finally {
    await browser.close();
  }
}
