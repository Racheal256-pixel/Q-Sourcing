import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRightIcon, PlusIcon } from '../components/Icons';
import { GigForm, type GigFormValues } from '../forms/GigForm';
import { rankCandidates } from '../lib/matching';
import { addOpportunity, useApp } from '../lib/store';

export function EmployerHome() {
  const app = useApp();
  const navigate = useNavigate();
  const [posting, setPosting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  function openForm() {
    setPosting(true);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function handleCreate(values: GigFormValues) {
    const id = addOpportunity(values);
    setPosting(false);
    navigate(`/employer/gigs/${id}`);
  }

  return (
    <div className="stack">
      <header className="page-head">
        <div>
          <p className="eyebrow">Employer view</p>
          <h1>Post the gig. See who fits.</h1>
          <p className="lede">
            Describe what you need, review a ranked shortlist, and see which candidates have already
            expressed interest.
          </p>
        </div>
        <div className="head-actions">
          <button type="button" className="btn btn-primary" onClick={openForm}>
            <PlusIcon size={16} /> Post a gig
          </button>
        </div>
      </header>

      <div className="metrics">
        <div className="metric">
          <span className="metric-value">{app.opportunities.length}</span>
          <span className="metric-label">Live gigs</span>
        </div>
        <div className="metric">
          <span className="metric-value">{app.candidates.length}</span>
          <span className="metric-label">Candidate profiles</span>
        </div>
        <div className="metric">
          <span className="metric-value">{app.shortlist.length}</span>
          <span className="metric-label">On shortlists</span>
        </div>
        <div className="metric">
          <span className="metric-value">{app.interests.length}</span>
          <span className="metric-label">Expressions of interest</span>
        </div>
      </div>

      {posting ? (
        <section ref={formRef} className="stack-sm">
          <div className="section-head">
            <div>
              <h2>New gig</h2>
              <p className="muted small">Required fields are checked before the gig is saved.</p>
            </div>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPosting(false)}>
              Close
            </button>
          </div>
          <GigForm submitLabel="Post gig" onSubmit={handleCreate} onCancel={() => setPosting(false)} />
        </section>
      ) : null}

      <section className="stack-sm">
        <div className="section-head">
          <h2>Your gigs</h2>
          <span className="muted small">Ranked matches open with one click</span>
        </div>
        {app.opportunities.length === 0 ? (
          <div className="card empty-state">
            <h3>No gigs posted yet.</h3>
            <p>Post your first gig to see a ranked shortlist of candidates.</p>
            <div className="empty-actions">
              <button type="button" className="btn btn-primary" onClick={openForm}>
                Post a gig
              </button>
            </div>
          </div>
        ) : (
          <div className="grid-2">
            {app.opportunities.map((opportunity) => {
              const matches = rankCandidates(app.candidates, opportunity);
              const suitable = matches.filter((match) => match.suitable).length;
              const shortlisted = app.shortlist.filter(
                (entry) => entry.opportunityId === opportunity.id,
              ).length;
              const interested = app.interests.filter(
                (entry) => entry.opportunityId === opportunity.id,
              ).length;
              return (
                <article className="card gig-card" key={opportunity.id}>
                  <div className="gig-card-top">
                    <span className="chip chip-soft">{opportunity.workType}</span>
                    <span className="chip chip-count">{suitable} suitable</span>
                  </div>
                  <h3>
                    <Link to={`/employer/gigs/${opportunity.id}`}>{opportunity.title}</Link>
                  </h3>
                  <p className="gig-employer">{opportunity.employer}</p>
                  <div className="meta-row">
                    <span>{opportunity.location}</span>
                    <span className="dot" aria-hidden="true">
                      ·
                    </span>
                    <span>
                      {opportunity.startNeed === 'Flexible'
                        ? 'Flexible start'
                        : `Starts ${opportunity.startNeed.toLowerCase()}`}
                    </span>
                  </div>
                  <div className="chips">
                    {opportunity.requiredSkills.slice(0, 4).map((skill) => (
                      <span className="chip" key={skill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="card-foot">
                    <Link to={`/employer/gigs/${opportunity.id}`} className="text-link">
                      View matches <ArrowRightIcon size={14} />
                    </Link>
                    <span className="muted small">
                      {shortlisted} shortlisted · {interested} interested
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="card how-card">
        <div>
          <h2>How matching works</h2>
          <p className="muted">
            Every gig is scored against every profile on four checks. The score is a starting point
            for your review, not a verdict.
          </p>
        </div>
        <ul className="weights">
          <li>
            <span>Required skills</span>
            <span>60%</span>
          </li>
          <li>
            <span>Availability against the start date</span>
            <span>15%</span>
          </li>
          <li>
            <span>Location, or remote</span>
            <span>15%</span>
          </li>
          <li>
            <span>Years of experience</span>
            <span>10%</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
