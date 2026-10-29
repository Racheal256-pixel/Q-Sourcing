import { Link } from 'react-router-dom';
import { CheckIcon } from '../components/Icons';
import { MatchHero } from '../components/Illustrations';
import { Avatar } from '../components/Layout';
import { MatchChecks } from '../components/MatchChecks';
import { ScoreBadge } from '../components/ScoreBadge';
import { matchCandidate } from '../lib/matching';
import { expressInterest, formatWhen, getInterest, setActiveCandidate, useApp } from '../lib/store';

export function CandidateHome() {
  const app = useApp();
  const active = app.candidates.find((candidate) => candidate.id === app.activeCandidateId);

  if (!active) {
    return (
      <div className="stack">
        <header className="page-head">
          <div>
            <p className="eyebrow">Candidate view</p>
            <h1>Your next gig starts with a profile.</h1>
            <p className="lede">
              Add your skills, experience, location, and availability. Then see which gigs fit.
            </p>
          </div>
        </header>
        <div className="card empty-state">
          <h3>No profile yet.</h3>
          <p>Create a candidate profile to see matched opportunities and express interest.</p>
          <div className="empty-actions">
            <Link className="btn btn-primary" to="/candidate/profile/new">
              Create your profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const ranked = app.opportunities
    .map((opportunity) => ({ opportunity, match: matchCandidate(active, opportunity) }))
    .sort((a, b) => b.match.score - a.match.score);

  return (
    <div className="stack">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Candidate view</p>
          <h1>Find work that fits your skills.</h1>
          <p className="lede">
            Gigs are ranked against your profile. Open one to see the exact reasons, or express
            interest straight away.
          </p>
          <div className="head-actions">
            <label className="viewing-as" htmlFor="acting-as">
              <span>Viewing as</span>
              <select
                id="acting-as"
                className="input select select-compact"
                value={active.id}
                onChange={(event) => setActiveCandidate(event.target.value)}
              >
                {app.candidates.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.name} · {candidate.headline}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <MatchHero className="hero-art" />
      </header>

      <section className="card profile-card">
        <div className="profile-top">
          <Avatar name={active.name} size="lg" />
          <div className="profile-title">
            <h2>{active.name}</h2>
            <p className="muted">{active.headline}</p>
          </div>
          <div className="profile-actions">
            <Link className="btn btn-secondary btn-sm" to="/candidate/profile">
              Edit profile
            </Link>
            <Link className="btn btn-ghost btn-sm" to="/candidate/profile/new">
              New profile
            </Link>
          </div>
        </div>

        <dl className="facts">
          <div>
            <dt>Location</dt>
            <dd>{active.location}</dd>
          </div>
          <div>
            <dt>Experience</dt>
            <dd>{active.yearsExperience} years</dd>
          </div>
          <div>
            <dt>Looking for</dt>
            <dd>{active.workType}</dd>
          </div>
          <div>
            <dt>Available</dt>
            <dd>{active.availability}</dd>
          </div>
        </dl>

        <div className="chips">
          {active.skills.map((skill) => (
            <span className="chip" key={skill}>
              {skill}
            </span>
          ))}
        </div>

        {active.about ? <p className="about">{active.about}</p> : null}
      </section>

      <section className="stack-sm">
        <div className="section-head">
          <div>
            <h2>Gigs for you</h2>
            <p className="muted small">Best fit first, based on skills, availability, and location.</p>
          </div>
          <span className="count-pill">{ranked.length} open</span>
        </div>

        {ranked.length === 0 ? (
          <div className="card empty-state">
            <h3>No gigs are open right now.</h3>
            <p>Check back later, or switch to the employer view to post one for the demo.</p>
            <div className="empty-actions">
              <Link className="btn btn-secondary" to="/employer">
                Go to employer view
              </Link>
            </div>
          </div>
        ) : (
          <div className="match-list">
            {ranked.map(({ opportunity, match }) => {
              const interest = getInterest(opportunity.id, active.id, app);
              const gigLink = `/candidate/gigs/${opportunity.id}`;
              return (
                <article className="card opp-row" key={opportunity.id}>
                  <ScoreBadge score={match.score} band={match.band} />
                  <div className="opp-body">
                    <h3>
                      <Link to={gigLink}>{opportunity.title}</Link>
                    </h3>
                    <p className="muted small">
                      {opportunity.employer} · {opportunity.location} · {opportunity.workType} ·{' '}
                      {opportunity.startNeed === 'Flexible'
                        ? 'flexible start'
                        : `starts ${opportunity.startNeed.toLowerCase()}`}
                    </p>

                    <MatchChecks parts={match.parts} />

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
                  </div>

                  <div className="opp-actions">
                    {interest ? (
                      <span className="status status-yes">
                        <CheckIcon size={12} /> Interested · {formatWhen(interest.createdAt)}
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => expressInterest(opportunity.id, active.id)}
                      >
                        Express interest
                      </button>
                    )}
                    <Link className="btn btn-secondary btn-sm" to={gigLink}>
                      View gig
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
