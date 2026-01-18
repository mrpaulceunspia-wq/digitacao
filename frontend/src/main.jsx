/* 📁 ARQUIVO: frontend/src/main.jsx
 * 🧠 RESPONSÁVEL POR: Bootstrap do React
 * 🔗 DEPENDÊNCIAS: react, react-dom, App, providers, estilos
 */

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.jsx';
import { AppProvider } from './contexts/AppContext.jsx';
import { NotifierProvider } from './ui/notify/NotifierProvider.jsx';
import './styles/variables.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/forms.css';
import './styles/buttons.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NotifierProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </NotifierProvider>
  </React.StrictMode>,
);
