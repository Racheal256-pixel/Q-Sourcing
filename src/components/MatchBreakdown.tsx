import type { Match } from '../lib/matching';

const LABELS: Record<Match['parts'][number]['key'], string> = {
  skills: 'Required skills',
  availability: 'Availability',
  location: 'Location',
  experience: 'Experience',
};

export function MatchBreakdown({ match }: { match: Match }) {
  return (
    <ul className="breakdown">
      {match.parts.map((part) => (
        <li key={part.key} className={part.ok ? '' : 'is-gap'}>
          <div className="breakdown-head">
            <span className="breakdown-label">{LABELS[part.key]}</span>
            <span className="breakdown-points">
              {part.points}/{part.max}
            </span>
          </div>
          <div className="bar" aria-hidden="true">
            <span style={{ width: `${Math.round((part.points / part.max) * 100)}%` }} />
          </div>
          <p className="breakdown-text">{part.text}</p>
        </li>
      ))}
    </ul>
  );
}
