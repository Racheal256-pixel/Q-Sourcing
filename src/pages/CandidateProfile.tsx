import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '../components/Icons';
import { ProfileForm, type ProfileFormValues } from '../forms/ProfileForm';
import { addCandidate, updateCandidate, useApp } from '../lib/store';

export function CandidateProfile({ mode }: { mode: 'new' | 'edit' }) {
  const app = useApp();
  const navigate = useNavigate();
  const active = app.candidates.find((candidate) => candidate.id === app.activeCandidateId);

  function handleSubmit(values: ProfileFormValues) {
    if (mode === 'edit' && active) {
      updateCandidate(active.id, values);
    } else {
      addCandidate(values);
    }
    navigate('/candidate');
  }

  if (mode === 'edit' && !active) {
    return (
      <div className="stack">
        <div className="card empty-state">
          <h1 className="h2">There is no profile to edit.</h1>
          <p>Create a candidate profile first.</p>
          <div className="empty-actions">
            <Link className="btn btn-primary" to="/candidate/profile/new">
              Create your profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stack">
      <Link className="back-link" to="/candidate">
        <ArrowLeftIcon size={14} /> Your matches
      </Link>

      <header className="page-head">
        <div>
          <p className="eyebrow">Candidate view</p>
          <h1>{mode === 'new' ? 'Create your profile' : 'Edit your profile'}</h1>
          <p className="lede">
            Employers see these details. Required fields are checked before the profile is saved.
          </p>
        </div>
      </header>

      <ProfileForm
        initial={mode === 'edit' ? active : undefined}
        submitLabel={mode === 'new' ? 'Save profile' : 'Save changes'}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/candidate')}
      />
    </div>
  );
}
