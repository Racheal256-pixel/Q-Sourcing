import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="skeleton-screen" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading page</span>
      {children}
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <Screen>
      <div className="sk-hero">
        <div className="sk-hero-copy">
          <div className="sk sk-eyebrow" />
          <div className="sk sk-title" />
          <div className="sk sk-title sk-title-short" />
          <div className="sk sk-lede" />
          <div className="sk sk-lede sk-lede-short" />
          <div className="sk sk-button" />
        </div>
        <div className="sk sk-art" />
      </div>
      <div className="sk-metrics">
        <div className="sk sk-metric" />
        <div className="sk sk-metric" />
        <div className="sk sk-metric" />
        <div className="sk sk-metric" />
      </div>
      <div className="sk-section">
        <div className="sk sk-section-title" />
        <div className="sk-grid">
          <div className="sk sk-card" />
          <div className="sk sk-card" />
        </div>
      </div>
    </Screen>
  );
}

export function DetailSkeleton() {
  return (
    <Screen>
      <div className="sk-stack">
        <div className="sk sk-back" />
        <div className="sk sk-detail-title" />
        <div className="sk sk-lede" />
        <div className="sk-chips">
          <div className="sk sk-chip" />
          <div className="sk sk-chip" />
          <div className="sk sk-chip-wide" />
        </div>
      </div>
      <div className="sk-list">
        <div className="sk sk-row" />
        <div className="sk sk-row" />
        <div className="sk sk-row" />
      </div>
    </Screen>
  );
}

export function FormSkeleton() {
  return (
    <Screen>
      <div className="sk-stack">
        <div className="sk sk-title" />
        <div className="sk sk-lede sk-lede-short" />
      </div>
      <div className="sk-panel">
        <div className="sk-form-grid">
          <div className="sk-field">
            <div className="sk sk-label" />
            <div className="sk sk-input" />
          </div>
          <div className="sk-field">
            <div className="sk sk-label" />
            <div className="sk sk-input" />
          </div>
          <div className="sk-field">
            <div className="sk sk-label" />
            <div className="sk sk-input" />
          </div>
          <div className="sk-field">
            <div className="sk sk-label" />
            <div className="sk sk-input" />
          </div>
          <div className="sk sk-textarea" />
        </div>
      </div>
    </Screen>
  );
}

export function RouteFallback() {
  const { pathname } = useLocation();
  if (pathname.includes('/profile')) return <FormSkeleton />;
  if (pathname.includes('/gigs/')) return <DetailSkeleton />;
  return <HomeSkeleton />;
}
