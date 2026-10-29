import type { ReactNode } from 'react';

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function Field({ id, label, error, hint, required, children, className = '' }: FieldProps) {
  return (
    <div className={`field ${error ? 'field-error' : ''} ${className}`.trim()}>
      <div className="field-head">
        <label htmlFor={id}>{label}</label>
        {required ? <span className="field-req">Required</span> : null}
      </div>
      {children}
      {error ? (
        <p className="field-msg" id={`${id}-error`}>
          <span className="field-mark" aria-hidden="true">
            !
          </span>
          {error}
        </p>
      ) : hint ? (
        <p className="field-hint">{hint}</p>
      ) : null}
    </div>
  );
}

export function FormErrorBanner({ errors, id = 'form-errors' }: { errors: Record<string, string>; id?: string }) {
  const entries = Object.entries(errors).filter(([, message]) => Boolean(message));
  if (entries.length === 0) return null;
  return (
    <div className="banner banner-error" id={id} role="alert">
      <p className="banner-title">Check these fields before saving:</p>
      <ul>
        {entries.map(([key, message]) => (
          <li key={key}>
            <a href={`#${key}`}>{message}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ErrorText({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p className="field-msg" id={id}>
      <span className="field-mark" aria-hidden="true">
        !
      </span>
      {children}
    </p>
  );
}
