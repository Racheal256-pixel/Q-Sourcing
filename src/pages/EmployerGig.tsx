import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, CheckIcon, CrossIcon } from '../components/Icons';
import { Avatar } from '../components/Layout';
import { MatchChecks } from '../components/MatchChecks';
import { ScoreBadge } from '../components/ScoreBadge';
import { GigForm, type GigFormValues } from '../forms/GigForm';
import { rankCandidates, SUITABLE_SCORE } from '../lib/matching';
import type { Match } from '../lib/matching';
import {
  formatWhen,
  getInterest,
  isShortlisted,
  toggleShortlist,
  updateOpportunity,
  useApp,
} from '../lib/store';

export function EmployerGig() {
  const { gigId = '' } = useParams();
  const app = useApp();
  const [editing, setEditing] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const opportunity = app.opportunities.find((item) => item.id === gigId);

  if (!opportunity) {
    return (
      <div className="stack">
        <Link className="back-link" to="/employer">
          <ArrowLeftIcon size={14} /> All gigs
        </Link>
        <div className="card empty-state">
          <h1 className="h2">This gig is no longer here.</h1>
          <p>It may have been removed, or the link is wrong.</p>
          <div className="empty-actions">
            <Link className="btn btn-primary" to="/employer">
              Back to gigs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const matches = rankCandidates(app.candidates, opportunity);
  const suitable = matches.filter((match) => match.suitable);
  const visible = showAll ? matches : suitable;
  const shortlistEntries = app.shortlist.filter((entry) => entry.opportunityId === opportunity.id);
  const interestCount = app.interests.filter((entry) => entry.opportunityId === opportunity.id).length;

  function handleEdit(values: GigFormValues) {
    updateOpportunity(gigId, values);
    setEditing(false);
  }

  return (
    <div className="stack">
      <Link className="back-link" to="/employer">
        <ArrowLeftIcon size={14} /> All gigs
      </Link>

      {editing ? (
        <section className="stack-sm">
          <div className="section-head">
            <div>
              <h1 className="h2">Edit requirements</h1>
              <p className="muted small">Saving recalculates the shortlist immediately.</p>
            </div>
          </div>
          <GigForm
            initial={opportunity}
            submitLabel="Save requirements"
            onSubmit={handleEdit}
            onCancel={() => setEditing(false)}
          />
        </section>
      ) : (
        <header className="page-head">
          <div>
            <p className="eyebrow">
              {opportunity.employer} · {opportunity.workType}
            </p>
            <h1>{opportunity.title}</h1>
            <p className="lede">{opportunity.description}</p>
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
                <span className="chip" key={skill}>
                  {skill}
                </span>
              ))}
              {opportunity.niceToHaveSkills.map((skill) => (
                <span className="chip chip-ghost" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="head-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setEditing(true)}>
              Edit requirements
            </button>
          </div>
        </header>
      )}

      <div className="split">
        <section className="stack-sm">
          <div className="section-head">
            <div>
              <h2>Candidates who fit</h2>
              <p className="muted small">
                Ranked by match score. Scores support your review, they do not guarantee suitability.
              </p>
            </div>
            <span className="count-pill">{suitable.length} suitable</span>
          </div>

          {visible.length === 0 ? (
            <div className="card empty-state">
              <span className="empty-mark" aria-hidden="true">
                ?
              </span>
              <h3>No suitable candidates for these requirements.</h3>
              <p>
                Nobody reaches {SUITABLE_SCORE}% with at least half of the required skills (
                {opportunity.requiredSkills.join(', ')}). Try widening the skills, the location, or
                the start date.
              </p>
              <div className="empty-actions">
                <button type="button" className="btn btn-primary" onClick={() => setEditing(true)}>
                  Edit requirements
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAll(true)}>
                  Show all {matches.length} candidates
                </button>
              </div>
              {matches.length > 0 ? (
                <p className="muted small empty-foot">
                  Closest profile: {matches[0].candidate.name} at {matches[0].score}%.
                </p>
              ) : null}
            </div>
          ) : (
            <>
              <div className="match-list">
                {visible.map((match) => (
                  <MatchRow key={match.candidate.id} match={match} gigId={opportunity.id} />
                ))}
              </div>
              {matches.length > suitable.length ? (
                <button
                  type="button"
                  className="btn btn-ghost btn-block"
                  onClick={() => setShowAll((current) => !current)}
                >
                  {showAll
                    ? `Show suitable candidates only (${suitable.length})`
                    : `Show all ${matches.length} candidates, including ${matches.length - suitable.length} not yet a fit`}
                </button>
              ) : null}
            </>
          )}
        </section>

        <aside className="stack-sm">
          <div className="card side-card">
            <div className="section-head">
              <h2>Shortlist</h2>
              <span className="count-pill">{shortlistEntries.length}</span>
            </div>
            {shortlistEntries.length === 0 ? (
              <p className="muted small">
                No one shortlisted yet. Add a candidate from the list and their interest status
                appears here.
              </p>
            ) : (
              <ul className="shortlist">
                {shortlistEntries.map((entry) => {
                  const candidate = app.candidates.find((item) => item.id === entry.candidateId);
                  if (!candidate) return null;
                  const interest = getInterest(opportunity.id, candidate.id, app);
                  const stillFits = matches.some(
                    (match) => match.candidate.id === candidate.id && match.suitable,
                  );
                  return (
                    <li key={entry.id}>
                      <Avatar name={candidate.name} size="sm" />
                      <div className="shortlist-body">
                        <Link to={`/employer/gigs/${opportunity.id}/candidates/${candidate.id}`}>
                          {candidate.name}
                        </Link>
                        <span className={interest ? 'status status-yes' : 'status'}>
                          {interest
                            ? `Expressed interest · ${formatWhen(interest.createdAt)}`
                            : 'No interest yet'}
                        </span>
                        {stillFits ? null : (
                          <span className="status status-warn">
                            No longer meets updated requirements
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label={`Remove ${candidate.name} from the shortlist`}
                        onClick={() => toggleShortlist(opportunity.id, candidate.id)}
                      >
                        <CrossIcon size={14} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="side-note">
              {interestCount === 0
                ? 'No expressions of interest yet.'
                : `${interestCount} expression${interestCount === 1 ? '' : 's'} of interest on this gig.`}
            </p>
          </div>

          <div className="card side-card">
            <h2>How this score is built</h2>
            <ul className="weights">
              <li>
                <span>Required skills</span>
                <span>60%</span>
              </li>
              <li>
                <span>Availability</span>
                <span>15%</span>
              </li>
              <li>
                <span>Location</span>
                <span>15%</span>
              </li>
              <li>
                <span>Experience</span>
                <span>10%</span>
              </li>
            </ul>
            <p className="muted small">
              A candidate counts as suitable at {SUITABLE_SCORE}% or more, with at least half of the
              required skills.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function MatchRow({ match, gigId }: { match: Match; gigId: string }) {
  const app = useApp();
  const shortlisted = isShortlisted(gigId, match.candidate.id, app);
  const interest = getInterest(gigId, match.candidate.id, app);
  const profileLink = `/employer/gigs/${gigId}/candidates/${match.candidate.id}`;

  return (
    <article className="card match-row">
      <ScoreBadge score={match.score} band={match.band} />
      <div className="match-body">
        <div className="match-head">
          <div className="match-id">
            <Avatar name={match.candidate.name} size="sm" />
            <div>
              <h3>
                <Link to={profileLink}>{match.candidate.name}</Link>
              </h3>
              <p className="muted small">
                {match.candidate.headline} · {match.candidate.location} ·{' '}
                {match.candidate.availability.toLowerCase()}
              </p>
            </div>
          </div>
          {interest ? (
            <span className="status status-yes">
              <CheckIcon size={12} /> Interested · {formatWhen(interest.createdAt)}
            </span>
          ) : null}
        </div>

        <MatchChecks parts={match.parts} />

        <div className="chips">
          {match.matchedSkills.map((skill) => (
            <span className="chip chip-ok" key={`ok-${skill}`}>
              {skill}
            </span>
          ))}
          {match.missingSkills.map((skill) => (
            <span className="chip chip-missing" key={`missing-${skill}`}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="match-actions">
        <Link className="btn btn-secondary btn-sm" to={profileLink}>
          View profile
        </Link>
        <button
          type="button"
          className={`btn btn-sm ${shortlisted ? 'btn-quiet' : 'btn-primary'}`}
          onClick={() => toggleShortlist(gigId, match.candidate.id)}
        >
          {shortlisted ? 'Remove' : 'Shortlist'}
        </button>
      </div>
    </article>
  );
}
