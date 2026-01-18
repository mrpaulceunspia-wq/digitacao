/* ARQUIVO: backend/src/controllers/pdf.controller.js
 * RESPONSAVEL POR: Controller de PDF (HTML + PDF)
 * DEPENDENCIAS: renderPdf
 */

import { renderHtml, renderPdf } from '../pdf/render/renderPdf.js';

const PRESETS = new Set(['compact', 'normal', 'loose']);

export function createPdfController() {
  return Object.freeze({
    async render(req, res, next) {
      try {
        const template = req.params.template || 'relatorio';
        const preset = PRESETS.has(req.query.preset) ? req.query.preset : 'normal';
        const html = renderHtml({ template, preset });

        if (req.query.preview === '1') {
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          return res.status(200).send(html);
        }

        const pdfBuffer = await renderPdf({ html });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${template}.pdf"`);
        return res.status(200).send(pdfBuffer);
      } catch (err) {
        return next(err);
      }
    },
  });
}
