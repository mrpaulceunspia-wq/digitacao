/* ARQUIVO: frontend/src/pages/MotivosPage.jsx
 * RESPONSAVEL POR: Tela de cadastro de motivos
 * DEPENDENCIAS: hooks, services, MSG, notifier
 */

import { useEffect, useRef, useState } from 'react';

import FormField from '../components/FormField.jsx';
import { createMotivo, listMotivos, removeMotivo, updateMotivo } from '../services/motivosApi.js';
import { PageShell } from '../ui/primitives/index.js';
import { MSG } from '../ui/messages/index.js';
import { notifier } from '../ui/notify/notifier.js';

export default function MotivosPage() {
  const [codigo, setCodigo] = useState('');
  const [motivo, setMotivo] = useState('');
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const codigoRef = useRef(null);
  const motivoRef = useRef(null);

  async function refresh() {
    const list = await listMotivos();
    setItems(list);
  }

  useEffect(() => {
    refresh().catch(() => {});
  }, []);

  function resetForm() {
    setCodigo('');
    setMotivo('');
    setEditingId(null);
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!codigo.trim()) {
      notifier.say('warn', 'validation', 'required', { field: MSG.get('forms', 'codigo') });
      return;
    }
    if (!motivo.trim()) {
      notifier.say('warn', 'validation', 'required', { field: MSG.get('forms', 'motivo') });
      return;
    }

    setBusy(true);
    try {
      if (editingId) {
        await updateMotivo(editingId, { codigo: codigo.trim(), motivo: motivo.trim() });
        notifier.success(MSG.get('general', 'updated'));
      } else {
        await createMotivo({ codigo: codigo.trim(), motivo: motivo.trim() });
        notifier.success(MSG.get('general', 'created'));
      }
      resetForm();
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  function onEdit(item) {
    setEditingId(item.id);
    setCodigo(item.codigo);
    setMotivo(item.motivo);
  }

  async function onRemove(id) {
    await removeMotivo(id);
    await refresh();
    notifier.success(MSG.get('general', 'deleted'));
  }

  return (
    <PageShell title={MSG.get('motivos', 'title')}>
      <form className="linc-grid" onSubmit={onSubmit}>
        <FormField
          labelKey="codigo"
          value={codigo}
          onChange={setCodigo}
          inputRef={codigoRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              motivoRef.current?.focus();
            }
          }}
        />
        <FormField
          labelKey="motivo"
          value={motivo}
          onChange={setMotivo}
          inputRef={motivoRef}
          onKeyDown={(e) => {
            if (e.key === 'Backspace') {
              const isEmpty = !motivo;
              const atStart =
                e.currentTarget.selectionStart === 0 && e.currentTarget.selectionEnd === 0;
              if (isEmpty && atStart) {
                e.preventDefault();
                codigoRef.current?.focus();
              }
            }
          }}
        />

        <div className="linc-actions">
          <button className="btn btn--primary" type="submit" disabled={busy}>
            {editingId ? MSG.get('general', 'update') : MSG.get('motivos', 'add')}
          </button>
          {editingId ? (
            <button className="btn btn--ghost" type="button" onClick={resetForm}>
              {MSG.get('general', 'cancel')}
            </button>
          ) : null}
        </div>
      </form>

      <div className="linc-spacer" />

      <div className="linc-table linc-table--motivos">
        <div className="linc-table__row linc-table__head">
          <div>{MSG.get('forms', 'codigo')}</div>
          <div>{MSG.get('forms', 'motivo')}</div>
          <div>{MSG.get('forms', 'actions')}</div>
        </div>

        {items.map((item) => (
          <div key={item.id} className="linc-table__row">
            <div>{item.codigo}</div>
            <div>{item.motivo}</div>
            <div className="linc-actions">
              <button className="btn btn--ghost" type="button" onClick={() => onEdit(item)}>
                {MSG.get('general', 'edit')}
              </button>
              <button className="btn btn--danger" type="button" onClick={() => onRemove(item.id)}>
                {MSG.get('general', 'delete')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
