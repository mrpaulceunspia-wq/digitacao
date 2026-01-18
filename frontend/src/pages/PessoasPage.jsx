/* 📁 ARQUIVO: frontend/src/pages/PessoasPage.jsx
 * 🧠 RESPONSÁVEL POR: Tela de cadastro de pessoas (Operador/Ajudante)
 * 🔗 DEPENDÊNCIAS: hooks, services, MSG, notifier
 */

import { useEffect, useMemo, useState } from 'react';

import FormField from '../components/FormField.jsx';
import SelectField from '../components/SelectField.jsx';
import { createPessoa, disablePessoa, listPessoas } from '../services/pessoasApi.js';
import { MSG } from '../ui/messages/index.js';
import { notifier } from '../ui/notify/notifier.js';
import { PageShell } from '../ui/primitives/index.js';

export default function PessoasPage() {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('OPERADOR');
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);

  const tipoOptions = useMemo(
    () => [
      { value: 'OPERADOR', label: MSG.get('people', 'typeOperador') },
      { value: 'AJUDANTE', label: MSG.get('people', 'typeAjudante') },
      { value: 'AMBOS', label: MSG.get('people', 'typeAmbos') },
    ],
    [],
  );

  async function refresh() {
    const list = await listPessoas({ ativo: 1 });
    setItems(list);
  }

  useEffect(() => {
    refresh().catch(() => {});
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (!nome.trim()) {
      notifier.say('warn', 'validation', 'required', { field: MSG.get('forms', 'nome') });
      return;
    }

    setBusy(true);
    try {
      await createPessoa({ nome: nome.trim(), tipo });
      setNome('');
      setTipo('OPERADOR');
      await refresh();
      notifier.success(MSG.get('general', 'created'));
    } finally {
      setBusy(false);
    }
  }

  async function onDisable(id) {
    await disablePessoa(id);
    await refresh();
    notifier.success(MSG.get('general', 'updated'));
  }

  return (
    <PageShell title={MSG.get('people', 'title')}>
      <form className="linc-grid" onSubmit={onSubmit}>
        <FormField labelKey="nome" value={nome} onChange={setNome} />
        <SelectField labelKey="tipoPessoa" value={tipo} onChange={setTipo} options={tipoOptions} allowEmpty={false} />

        <div className="linc-actions">
          <button className="btn btn--primary" type="submit" disabled={busy}>
            {MSG.get('people', 'add')}
          </button>
        </div>
      </form>

      <div className="linc-spacer" />

      <div className="linc-table">
        <div className="linc-table__row linc-table__head">
          <div>{MSG.get('forms', 'id')}</div>
          <div>{MSG.get('forms', 'nome')}</div>
          <div>{MSG.get('forms', 'tipoPessoa')}</div>
          <div>{MSG.get('forms', 'actions')}</div>
        </div>

        {items.map((p) => (
          <div key={p.id} className="linc-table__row">
            <div>{p.id}</div>
            <div>{p.nome}</div>
            <div>{p.tipo}</div>
            <div>
              <button className="btn btn--danger" type="button" onClick={() => onDisable(p.id)}>
                {MSG.get('general', 'disable')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
