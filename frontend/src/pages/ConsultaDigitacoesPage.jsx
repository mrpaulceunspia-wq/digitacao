/* ARQUIVO: frontend/src/pages/ConsultaDigitacoesPage.jsx
 * RESPONSAVEL POR: Consulta de digitacoes (filtros, edicao, exclusao)
 * DEPENDENCIAS: hooks, services, MSG, notifier
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';

import FormField from '../components/FormField.jsx';
import { listarDigitacoes, removerDigitacao } from '../services/digitacoesApi.js';
import { MSG } from '../ui/messages/index.js';
import { notifier } from '../ui/notify/notifier.js';
import { PageShell } from '../ui/primitives/index.js';

export default function ConsultaDigitacoesPage() {
  const [ofNumero, setOfNumero] = useState('');
  const [ofItem, setOfItem] = useState('');
  const [numBobina, setNumBobina] = useState('');
  const [dataDe, setDataDe] = useState('');
  const [dataAte, setDataAte] = useState('');
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);

  async function onBuscar(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await listarDigitacoes({
        ofNumero: ofNumero || undefined,
        ofItem: ofItem || undefined,
        numBobina: numBobina || undefined,
        dataDe: dataDe || undefined,
        dataAte: dataAte || undefined,
        order: 'desc',
      });
      setItems(res.data || []);
    } finally {
      setBusy(false);
    }
  }

  async function onRemove(id) {
    await removerDigitacao(id);
    notifier.success(MSG.get('general', 'deleted'));
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <PageShell title={MSG.get('consulta', 'title')}>
      <form className="linc-grid" onSubmit={onBuscar}>
        <FormField labelKey="ofNumero" value={ofNumero} onChange={setOfNumero} />
        <FormField labelKey="ofItem" value={ofItem} onChange={setOfItem} />
        <FormField labelKey="numBobina" value={numBobina} onChange={setNumBobina} />
        <FormField labelKey="dataDe" type="date" value={dataDe} onChange={setDataDe} />
        <FormField labelKey="dataAte" type="date" value={dataAte} onChange={setDataAte} />

        <div className="linc-actions">
          <button className="btn btn--primary" type="submit" disabled={busy}>
            {MSG.get('general', 'search')}
          </button>
        </div>
      </form>

      <div className="linc-spacer" />

      <div className="linc-table linc-table--consulta">
        <div className="linc-table__row linc-table__head">
          <div>{MSG.get('forms', 'data')}</div>
          <div>{MSG.get('forms', 'ofNumero')}</div>
          <div>{MSG.get('forms', 'ofItem')}</div>
          <div>{MSG.get('forms', 'numBobina')}</div>
          <div>{MSG.get('forms', 'produto')}</div>
          <div>{MSG.get('forms', 'cliente')}</div>
          <div>{MSG.get('forms', 'actions')}</div>
        </div>

        {items.map((item) => (
          <div key={item.id} className="linc-table__row">
            <div>{item.data}</div>
            <div>{item.of_numero}</div>
            <div>{item.of_item}</div>
            <div>{item.num_bobina || ''}</div>
            <div>{item.produto}</div>
            <div>{item.cliente || ''}</div>
            <div className="linc-actions">
              <Link className="btn btn--ghost" to={`/digitacao/${item.id}`}>
                {MSG.get('general', 'edit')}
              </Link>
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
