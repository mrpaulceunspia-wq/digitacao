/* 📁 ARQUIVO: frontend/src/App.jsx
 * 🧠 RESPONSÁVEL POR: Rotas principais
 * 🔗 DEPENDÊNCIAS: react-router-dom, pages, Layout
 */

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Layout from './components/Layout.jsx';
import ConsultaDigitacoesPage from './pages/ConsultaDigitacoesPage.jsx';
import DigitacaoPage from './pages/DigitacaoPage.jsx';
import HomePage from './pages/HomePage.jsx';
import MotivosPage from './pages/MotivosPage.jsx';
import PessoasPage from './pages/PessoasPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/digitacao" element={<DigitacaoPage />} />
          <Route path="/digitacao/:id" element={<DigitacaoPage />} />
          <Route path="/consulta" element={<ConsultaDigitacoesPage />} />
          <Route path="/motivos" element={<MotivosPage />} />
          <Route path="/pessoas" element={<PessoasPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
