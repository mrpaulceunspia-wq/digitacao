/* 📁 ARQUIVO: frontend/src/contexts/AppContext.jsx
 * 🧠 RESPONSÁVEL POR: Estado global mínimo via Context API (linhas, fibras, turnos)
 * 🔗 DEPENDÊNCIAS: react
 */

import { createContext, useContext, useMemo } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const value = useMemo(
    () => ({
      linhas: [1, 2, 4, 5, 6].map((n) => ({ value: String(n), label: String(n) })),
      fibras: ['F1', 'F2', 'F4', 'F5', 'F6'].map((f) => ({ value: f, label: f })),
      turnos: ['1', '2', '3'].map((t) => ({ value: t, label: t })),
    }),
    [],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('AppContext ausente');
  return ctx;
}
