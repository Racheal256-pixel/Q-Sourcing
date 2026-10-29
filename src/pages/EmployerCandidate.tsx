import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, CheckIcon } from '../components/Icons';
import { Avatar } from '../components/Layout';
import { MatchBreakdown } from '../components/MatchBreakdown';
import { ScoreBadge } from '../components/ScoreBadge';
import { matchCandidate } from '../lib/matching';
import {
  formatWhen,
  getInterest,
  isShortlisted,
  setActiveCandidate,
  toggleShortlist,
  useApp,
} from '../lib/store';

export function EmployerCandidate() {
  const { gigId = '', candId = '' } = useParams();
  const app = useApp();
  const navigate = useNavigate();

  const opportunity = app.opportunities.find((item) => item.id === gigId);
  const candidate = app.candidates.find((item) => item.id === candId);

  if (!opportunity || !candidate) {
    return (
      <div className="stack">
        <Link className="back-link" to={opportunity ? `/employer/gigs/${opportunity.id}` : '/employer'}>
          <ArrowLeftIcon size={14} /> {opportunity ? 'Back to matches' : 'All gigs'}
        </Link>
        <div className="card empty-state">
          <h1 className="h2">This profile cannot be found.</h1>
          <p>It may have been removed, or the link is wrong.</p>
          <div className="empty-actions">
            <Link className="btn btn-primary" to={opportunity ? `/employer/gigs/${opportunity.id}` : '/employer'}>
              Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const match = matchCandidate(candidate, opportunity);
  const interest = getInterest(opportunity.id, candidate.id, app);
  const shortlisted = isShortlisted(opportunity.id, candidate.id, app);

  function openCandidateView() {
    setActiveCandidate(candidate!.id);
    navigate(`/candidate/gigs/${opportunity!.id}`);
  }

  return (
    <div className="stack">
      <Link className="back-link" to={`/employer/gigs/${opportunity.id}`}>
        <ArrowLeftIcon size={14} /> Back to matches
      </Link>

      <header className="card profile-card">
        <div className="profile-top">
          <Avatar name={candidate.name} size="lg" />
          <div className="profile-title">
            <h1 className="h2">{candidate.name}</h1>
            <p className="muted">{candidate.headline}</p>
          </div>
          <div className="profile-actions">
            <button
              type="button"
              className={`btn btn-sm ${shortlisted ? 'btn-quiet' : 'btn-primary'}`}
              onClick={() => toggleShortlist(opportunity.id, candidate.id)}
            >
              {shortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
            </button>
          </div>
        </div>

        <dl className="facts">
          <div>
            <dt>Location</dt>
            <dd>{candidate.location}</dd>
          </div>
          <div>
            <dt>Experience</dt>
            <dd>{candidate.yearsExperience} years</dd>
          </div>
          <div>
            <dt>Looking for</dt>
            <dd>{candidate.workType}</dd>
          </div>
          <div>
            <dt>Available</dt>
            <dd>{candidate.availability}</dd>
          </div>
        </dl>

        <div className="chips">
          {candidate.skills.map((skill) => (
            <span
              className={`chip ${match.matchedSkills.some((item) => item.toLowerCase() === skill.toLowerCase()) ? 'chip-ok' : ''}`}
              key={skill}
            >
              {skill}
            </span>
          ))}
        </div>

        {candidate.about ? <p className="about">{candidate.about}</p> : null}
      </header>

      <div className="split">
        <section className="card">
          <div className="section-head">
            <div>
              <h2>Why this candidate scored {match.score}%</h2>
              <p className="muted small">Against {opportunity.title}.</p>
            </div>
            <ScoreBadge score={match.score} band={match.band} size="lg" />
          </div>
          <MatchBreakdown match={match} />
          <p className="disclaimer">
            This score supports your review. It cannot judge attitude, references, or work samples,
            so confirm those with the candidate before deciding.
          </p>
        </section>

        <aside className="stack-sm">
          <div className="card side-card">
            <h2>Interest status</h2>
            {interest ? (
              <>
                <p className="status status-yes status-block">
                  <CheckIcon size={14} /> Expressed interest
                </p>
                <p className="muted small">On {formatWhen(interest.createdAt)}, for this gig.</p>
              </>
            ) : (
              <>
                <p className="status status-block">No interest expressed yet</p>
                <p className="muted small">
                  Open the candidate view to express interest on their behalf for the demo, then
                  come back here to see it recorded.
                </p>
                <button type="button" className="btn btn-secondary btn-block" onClick={openCandidateView}>
                  Open candidate view
                </button>
              </>
            )}
          </div>

          <div className="card side-card">
            <h2>Recommendation</h2>
            <p className="muted small">
              {match.suitable
                ? 'This candidate clears the suitability bar. Shortlist them and check availability before arranging a call.'
                : 'This candidate is below the suitability bar for the current requirements. Shortlist only if you are willing to relax a requirement.'}
            </p>
            <Link className="btn btn-secondary btn-block" to={`/employer/gigs/${opportunity.id}`}>
              Back to the full list
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
