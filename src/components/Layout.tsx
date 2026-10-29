import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { resetDemo } from '../lib/store';

export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
  return (
    <span className={`avatar avatar-${size}`} aria-hidden="true">
      {initials}
    </span>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              K
            </span>
            <span className="brand-text">
              <strong>KaziLink</strong>
              <small>Talent and gig matching</small>
            </span>
          </div>
          <nav className="role-switch" aria-label="Switch between employer and candidate views">
            <NavLink
              to="/employer"
              className={({ isActive }) => `role-tab${isActive ? ' is-active' : ''}`}
            >
              Employer
            </NavLink>
            <NavLink
              to="/candidate"
              className={({ isActive }) => `role-tab${isActive ? ' is-active' : ''}`}
            >
              Candidate
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="page">{children}</main>

      <footer className="footer">
        <p>
          Demo for the Career Expo 2026 live employer challenge. All profiles and gigs are fictional.
          Match scores support human review and are not a guarantee of suitability.
        </p>
        <button
          type="button"
          className="link-button"
          onClick={() => {
            if (window.confirm('Reset the demo back to the seeded profiles and gigs?')) {
              resetDemo();
            }
          }}
        >
          Reset demo data
        </button>
      </footer>
    </div>
  );
}
