/* 📁 ARQUIVO: frontend/src/components/Layout.jsx
 * 🧠 RESPONSÁVEL POR: Layout com navegação
 * 🔗 DEPENDÊNCIAS: react-router-dom, MSG
 */

import { NavLink, Outlet } from 'react-router-dom';

import { MSG } from '../ui/messages/index.js';

function NavItem({ to, labelKey }) {
  return (
    <NavLink className={({ isActive }) => `linc-nav__link ${isActive ? 'is-active' : ''}`} to={to}>
      {MSG.get('nav', labelKey)}
    </NavLink>
  );
}

export default function Layout() {
  return (
    <div className="linc-app">
      <header className="linc-header">
        <div className="linc-header__brand">
          <img className="linc-logo" src="/assets/linc.png" alt={MSG.get('general', 'logoAlt')} />
          <span className="linc-header__title">{MSG.get('general', 'appTitle')}</span>
        </div>
        <nav className="linc-nav">
          <NavItem to="/digitacao" labelKey="digitacao" />
          <NavItem to="/consulta" labelKey="consulta" />
          <NavItem to="/motivos" labelKey="motivos" />
          <NavItem to="/pessoas" labelKey="pessoas" />
        </nav>
      </header>

      <main className="linc-main">
        <Outlet />
      </main>

      <footer className="linc-footer">{MSG.get('general', 'footer')}</footer>
    </div>
  );
}
