import type { Band } from '../lib/matching';

const BAND_CLASS: Record<Band, string> = {
  'Strong match': 'strong',
  'Good match': 'good',
  Stretch: 'stretch',
  'Low match': 'low',
};

interface ScoreBadgeProps {
  score: number;
  band: Band;
  size?: 'sm' | 'lg';
}

const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScoreBadge({ score, band, size = 'sm' }: ScoreBadgeProps) {
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;
  return (
    <div
      className={`score score-${size} score-${BAND_CLASS[band]}`}
      role="img"
      aria-label={`Match score ${score} percent, ${band.toLowerCase()}`}
    >
      <span className="score-dial">
        <svg className="score-ring" viewBox="0 0 48 48" aria-hidden="true">
          <circle className="score-track" cx="24" cy="24" r={RADIUS} />
          <circle
            className="score-fill"
            cx="24"
            cy="24"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="score-num">
          {score}
          <span className="score-pct">%</span>
        </span>
      </span>
      {size === 'lg' ? <span className="score-label">{band}</span> : null}
    </div>
  );
}
