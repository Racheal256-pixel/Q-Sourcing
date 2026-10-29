import type { MatchPart } from '../lib/matching';
import { CheckIcon, CrossIcon } from './Icons';

export function MatchChecks({ parts }: { parts: MatchPart[] }) {
  return (
    <ul className="reasons checks">
      {parts.map((part) => (
        <li key={part.key} className={part.ok ? undefined : 'gap'}>
          {part.ok ? <CheckIcon className="ico-ok" /> : <CrossIcon className="ico-gap" />} {part.text}
        </li>
      ))}
    </ul>
  );
}
