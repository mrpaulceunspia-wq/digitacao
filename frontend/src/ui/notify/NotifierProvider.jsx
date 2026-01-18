/* ARQUIVO: frontend/src/ui/notify/NotifierProvider.jsx
 * RESPONSAVEL POR: Provider de notificacoes (render + bind do notifier)
 * DEPENDENCIAS: react, notifier, MSG
 */

import { useEffect, useMemo, useState } from 'react';

import { MSG } from '../messages/index.js';
import { notifier } from './notifier.js';

function NotifierView({ items, onRemove }) {
  return (
    <div className="linc-toast-wrap" aria-live="polite">
      {items.map((it) => (
        <div key={it.id} className={`linc-toast linc-toast--${it.type}`}>
          <div className="linc-toast__msg">{it.message}</div>
          <button
            className="btn btn--ghost"
            onClick={() => onRemove(it.id)}
            type="button"
            aria-label={MSG.get('general', 'close')}
          >
            {MSG.get('general', 'close')}
          </button>
        </div>
      ))}
    </div>
  );
}

export function NotifierProvider({ children }) {
  const [items, setItems] = useState([]);

  const api = useMemo(
    () => ({
      push(next) {
        const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        setItems((prev) => [...prev, { ...next, id }].slice(-5));
        setTimeout(() => {
          setItems((prev) => prev.filter((p) => p.id !== id));
        }, 4500);
      },
      remove(id) {
        setItems((prev) => prev.filter((p) => p.id !== id));
      },
    }),
    [],
  );

  useEffect(() => {
    notifier.bind(api.push);
  }, [api]);

  return (
    <>
      {children}
      <NotifierView items={items} onRemove={api.remove} />
    </>
  );
}
