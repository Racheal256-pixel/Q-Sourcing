import { useState, type FormEvent } from 'react';
import { Field, FormErrorBanner } from '../components/Field';
import { Spinner } from '../components/Spinner';
import { splitSkills } from '../lib/matching';
import { AVAILABILITY_OPTIONS, WORK_TYPES } from '../types';
import type { Availability, Candidate, WorkType } from '../types';

export type ProfileFormValues = Omit<Candidate, 'id' | 'createdAt'>;

interface ProfileFormProps {
  initial?: Candidate;
  submitLabel: string;
  onSubmit: (values: ProfileFormValues) => void;
  onCancel?: () => void;
}

export function ProfileForm({ initial, submitLabel, onSubmit, onCancel }: ProfileFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [headline, setHeadline] = useState(initial?.headline ?? '');
  const [skills, setSkills] = useState(initial?.skills.join(', ') ?? '');
  const [years, setYears] = useState(String(initial?.yearsExperience ?? 0));
  const [location, setLocation] = useState(initial?.location ?? '');
  const [workType, setWorkType] = useState<WorkType>(initial?.workType ?? 'Full-time');
  const [availability, setAvailability] = useState<Availability>(initial?.availability ?? 'Immediately');
  const [about, setAbout] = useState(initial?.about ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    const next: Record<string, string> = {};
    const parsedSkills = splitSkills(skills);
    const parsedYears = Number(years);

    if (!name.trim()) next.name = 'Enter your full name.';
    if (!headline.trim()) next.headline = 'Enter a short headline, such as "Frontend developer".';
    if (parsedSkills.length === 0) {
      next.skills = 'Add at least one skill, separated by commas.';
    }
    if (!Number.isFinite(parsedYears) || parsedYears < 0 || parsedYears > 50) {
      next.yearsExperience = 'Years of experience must be a number from 0 to 50.';
    }
    if (!location.trim()) next.location = 'Enter your city, or type Remote.';

    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.getElementById('profile-form-errors')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      document.getElementById(Object.keys(next)[0])?.focus({ preventScroll: true });
      return;
    }

    setSaving(true);
    window.setTimeout(() => {
      onSubmit({
        name: name.trim(),
        headline: headline.trim(),
        skills: parsedSkills,
        yearsExperience: parsedYears,
        location: location.trim(),
        workType,
        availability,
        about: about.trim(),
      });
    }, 400);
  }

  const describedBy = (id: string) => (errors[id] ? `${id}-error` : undefined);

  return (
    <form className="card form-card" onSubmit={handleSubmit} noValidate>
      <FormErrorBanner errors={errors} id="profile-form-errors" />

      <div className="form-grid">
        <Field id="name" label="Full name" required error={errors.name}>
          <input
            id="name"
            className="input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Amina Nakato"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy('name')}
          />
        </Field>

        <Field id="headline" label="Headline" required error={errors.headline}>
          <input
            id="headline"
            className="input"
            value={headline}
            onChange={(event) => setHeadline(event.target.value)}
            placeholder="e.g. Frontend developer"
            aria-invalid={Boolean(errors.headline)}
            aria-describedby={describedBy('headline')}
          />
        </Field>

        <Field
          id="skills"
          label="Skills"
          required
          error={errors.skills}
          className="field-wide"
          hint="Separate skills with commas. Use the same words employers use."
        >
          <input
            id="skills"
            className="input"
            value={skills}
            onChange={(event) => setSkills(event.target.value)}
            placeholder="React, TypeScript, CSS, Git"
            aria-invalid={Boolean(errors.skills)}
            aria-describedby={describedBy('skills')}
          />
        </Field>

        <Field
          id="yearsExperience"
          label="Years of experience"
          error={errors.yearsExperience}
        >
          <input
            id="yearsExperience"
            className="input"
            type="number"
            min={0}
            max={50}
            step={1}
            value={years}
            onChange={(event) => setYears(event.target.value)}
            aria-invalid={Boolean(errors.yearsExperience)}
            aria-describedby={describedBy('yearsExperience')}
          />
        </Field>

        <Field id="location" label="Location" required error={errors.location} hint="City, or type Remote.">
          <input
            id="location"
            className="input"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Kampala"
            aria-invalid={Boolean(errors.location)}
            aria-describedby={describedBy('location')}
          />
        </Field>

        <Field id="workType" label="Looking for">
          <select
            id="workType"
            className="input select"
            value={workType}
            onChange={(event) => setWorkType(event.target.value as WorkType)}
          >
            {WORK_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>

        <Field id="availability" label="Available to start">
          <select
            id="availability"
            className="input select"
            value={availability}
            onChange={(event) => setAvailability(event.target.value as Availability)}
          >
            {AVAILABILITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id="about"
          label="About you"
          className="field-wide"
          hint="Optional. One or two sentences on what you have done."
        >
          <textarea
            id="about"
            className="input textarea"
            value={about}
            onChange={(event) => setAbout(event.target.value)}
            rows={3}
          />
        </Field>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving} aria-busy={saving}>
          {saving ? (
            <>
              <Spinner /> Saving...
            </>
          ) : (
            submitLabel
          )}
        </button>
        {onCancel ? (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
