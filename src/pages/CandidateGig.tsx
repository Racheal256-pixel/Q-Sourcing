import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, CheckIcon, CrossIcon } from '../components/Icons';
import { Avatar } from '../components/Layout';
import { MatchBreakdown } from '../components/MatchBreakdown';
import { ScoreBadge } from '../components/ScoreBadge';
import { matchCandidate } from '../lib/matching';
import { expressInterest, formatWhen, getInterest, useApp } from '../lib/store';

export function CandidateGig() {
  const { gigId = '' } = useParams();
  const app = useApp();
  const active = app.candidates.find((candidate) => candidate.id === app.activeCandidateId);
  const opportunity = app.opportunities.find((item) => item.id === gigId);

  if (!opportunity) {
    return (
      <div className="stack">
        <Link className="back-link" to="/candidate">
          <ArrowLeftIcon size={14} /> Your matches
        </Link>
        <div className="card empty-state">
          <h1 className="h2">This gig is no longer open.</h1>
          <p>It may have been removed, or the link is wrong.</p>
          <div className="empty-actions">
            <Link className="btn btn-primary" to="/candidate">
              Back to your matches
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!active) {
    return (
      <div className="stack">
        <div className="card empty-state">
          <h1 className="h2">Create a profile first.</h1>
          <p>You need a candidate profile before you can express interest in a gig.</p>
          <div className="empty-actions">
            <Link className="btn btn-primary" to="/candidate/profile/new">
              Create your profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const match = matchCandidate(active, opportunity);
  const interest = getInterest(opportunity.id, active.id, app);
  const alreadyShortlisted = app.shortlist.some(
    (entry) => entry.opportunityId === opportunity.id && entry.candidateId === active.id,
  );

  return (
    <div className="stack">
      <Link className="back-link" to="/candidate">
        <ArrowLeftIcon size={14} /> Your matches
      </Link>

      <header className="page-head">
        <div>
          <p className="eyebrow">
            {opportunity.employer} · {opportunity.workType}
          </p>
          <h1>{opportunity.title}</h1>
          <div className="meta-row">
            <span>{opportunity.location}</span>
            <span className="dot" aria-hidden="true">
              ·
            </span>
            <span>
              {opportunity.startNeed === 'Flexible'
                ? 'Flexible start'
                : `Needs someone ${opportunity.startNeed.toLowerCase()}`}
            </span>
            <span className="dot" aria-hidden="true">
              ·
            </span>
            <span>
              {opportunity.minYearsExperience === 0
                ? 'No minimum experience'
                : `${opportunity.minYearsExperience}+ years`}
            </span>
          </div>
          <div className="chips">
            {opportunity.requiredSkills.map((skill) => (
              <span
                className={`chip ${match.matchedSkills.includes(skill) ? 'chip-ok' : 'chip-missing'}`}
                key={skill}
              >
                {skill}
              </span>
            ))}
          </div>
          {opportunity.niceToHaveSkills.length > 0 ? (
            <div className="chips">
              <span className="chip-label">Nice to have:</span>
              {opportunity.niceToHaveSkills.map((skill) => (
                <span className="chip chip-ghost" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <div className="split">
        <section className="stack-sm">
          <div className="card">
            <h2>About this gig</h2>
            <p className="body-text">{opportunity.description}</p>
          </div>

          <div className="card">
            <div className="section-head">
              <div>
                <h2>Why you scored {match.score}%</h2>
                <p className="muted small">How {active.name} lines up with these requirements.</p>
              </div>
              <ScoreBadge score={match.score} band={match.band} size="lg" />
            </div>
            <MatchBreakdown match={match} />
          </div>
        </section>

        <aside className="stack-sm">
          <div className="card side-card">
            <div className="profile-top profile-top-sm">
              <Avatar name={active.name} size="sm" />
              <div className="profile-title">
                <h2 className="h3">Acting as</h2>
                <p className="muted small">{active.name}</p>
              </div>
            </div>

            {interest ? (
              <>
                <p className="status status-yes status-block">
                  <CheckIcon size={14} /> Interest sent
                </p>
                <p className="muted small">
                  Sent to {opportunity.employer} on {formatWhen(interest.createdAt)}. Your name now
                  carries an "Interested" badge in their shortlist.
                </p>
                <Link className="btn btn-primary btn-block" to={`/employer/gigs/${opportunity.id}`}>
                  Back to employer shortlist
                </Link>
              </>
            ) : (
              <>
                <p className="muted small">
                  {match.suitable
                    ? 'Your profile meets the bar for this gig.'
                    : 'You are below the usual bar for this gig. You can still express interest, but the employer will see the gaps.'}
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={() => expressInterest(opportunity.id, active.id)}
                >
                  Express interest
                </button>
                {match.gaps.length > 0 ? (
                  <ul className="reasons reasons-compact">
                    {match.gaps.map((gap) => (
                      <li key={gap} className="gap">
                        <CrossIcon className="ico-gap" /> {gap}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </>
            )}

            {alreadyShortlisted ? (
              <p className="muted small side-note">
                The employer has already shortlisted {active.name} for this gig.
              </p>
            ) : null}
          </div>

          <div className="card side-card">
            <h2>Not your fit?</h2>
            <p className="muted small">
              Update your skills, availability, or location and the ranking updates everywhere.
            </p>
            <Link className="btn btn-secondary btn-block" to="/candidate/profile">
              Edit profile
            </Link>
            <Link className="btn btn-ghost btn-block" to="/candidate">
              Back to your matches
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
