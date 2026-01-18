/* ARQUIVO: frontend/src/components/OfSearchModal.jsx
 * RESPONSAVEL POR: Modal para selecionar OF retornada do Protheus
 * DEPENDENCIAS: MSG
 */

import { MSG } from '../ui/messages/index.js';

function ModalShell({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="linc-modal__backdrop" role="dialog" aria-modal="true">
      <div className="linc-modal">
        <div className="linc-modal__header">
          <div className="linc-modal__title">{title}</div>
          <button className="btn btn--ghost" type="button" onClick={onClose} aria-label={MSG.get('general', 'close')}>
            {MSG.get('general', 'close')}
          </button>
        </div>
        <div className="linc-modal__content">{children}</div>
      </div>
    </div>
  );
}

export default function OfSearchModal({ open, items, onSelect, onClose }) {
  return (
    <ModalShell open={open} title={MSG.get('digitacao', 'ofSearchTitle')} onClose={onClose}>
      {items.length ? (
        <div className="linc-table">
          <div className="linc-table__row linc-table__head">
            <div>{MSG.get('forms', 'ofHeader')}</div>
            <div>{MSG.get('forms', 'item')}</div>
            <div>{MSG.get('forms', 'codProduto')}</div>
            <div>{MSG.get('forms', 'produto')}</div>
            <div>{MSG.get('forms', 'cliente')}</div>
            <div>{MSG.get('forms', 'actions')}</div>
          </div>

          {items.map((it) => (
            <div key={`${it.ofNumero}-${it.ofItem}`} className="linc-table__row">
              <div>{it.ofNumero}</div>
              <div>{it.ofItem}</div>
              <div>{it.codProduto}</div>
              <div>{it.produto}</div>
              <div>{it.cliente || ''}</div>
              <div>
                <button className="btn btn--primary" type="button" onClick={() => onSelect(it)}>
                  {MSG.get('general', 'select')}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>{MSG.get('protheus', 'notFound')}</div>
      )}
    </ModalShell>
  );
}
