import { useState, type FormEvent } from 'react';
import { Field, FormErrorBanner } from '../components/Field';
import { Spinner } from '../components/Spinner';
import { splitSkills } from '../lib/matching';
import { START_OPTIONS, WORK_TYPES } from '../types';
import type { Opportunity, StartNeed, WorkType } from '../types';

export type GigFormValues = Omit<Opportunity, 'id' | 'createdAt'>;

interface GigFormProps {
  initial?: Opportunity;
  submitLabel: string;
  onSubmit: (values: GigFormValues) => void;
  onCancel?: () => void;
}

export function GigForm({ initial, submitLabel, onSubmit, onCancel }: GigFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [employer, setEmployer] = useState(initial?.employer ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [requiredSkills, setRequiredSkills] = useState(initial?.requiredSkills.join(', ') ?? '');
  const [niceSkills, setNiceSkills] = useState(initial?.niceToHaveSkills.join(', ') ?? '');
  const [location, setLocation] = useState(initial?.location ?? '');
  const [workType, setWorkType] = useState<WorkType>(initial?.workType ?? 'Full-time');
  const [minYears, setMinYears] = useState(String(initial?.minYearsExperience ?? 0));
  const [startNeed, setStartNeed] = useState<StartNeed>(initial?.startNeed ?? 'Within 2 weeks');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    const next: Record<string, string> = {};
    const skills = splitSkills(requiredSkills);
    const years = Number(minYears);

    if (!title.trim()) next.title = 'Enter a title for the gig.';
    if (!employer.trim()) next.employer = 'Enter the employer or company name.';
    if (description.trim().length < 20) {
      next.description = 'Describe the work in at least 20 characters.';
    }
    if (skills.length === 0) {
      next.requiredSkills = 'Add at least one required skill, separated by commas.';
    }
    if (!location.trim()) next.location = 'Enter the city, or type Remote.';
    if (!Number.isFinite(years) || years < 0 || years > 40) {
      next.minYearsExperience = 'Years of experience must be a number from 0 to 40.';
    }

    setErrors(next);
    if (Object.keys(next).length > 0) {
      requestAnimationFrame(() => {
        document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      });
      return;
    }

    setSaving(true);
    window.setTimeout(() => {
      onSubmit({
        title: title.trim(),
        employer: employer.trim(),
        description: description.trim(),
        requiredSkills: skills,
        niceToHaveSkills: splitSkills(niceSkills),
        location: location.trim(),
        workType,
        minYearsExperience: years,
        startNeed,
      });
    }, 400);
  }

  const describedBy = (id: string) => (errors[id] ? `${id}-error` : undefined);

  return (
    <form className="card form-card" onSubmit={handleSubmit} noValidate>
      <FormErrorBanner errors={errors} id="gig-form-errors" />

      <div className="form-grid">
        <Field id="title" label="Gig title" required error={errors.title}>
          <input
            id="title"
            className="input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Frontend Developer (React)"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={describedBy('title')}
          />
        </Field>

        <Field id="employer" label="Employer" required error={errors.employer}>
          <input
            id="employer"
            className="input"
            value={employer}
            onChange={(event) => setEmployer(event.target.value)}
            placeholder="e.g. Kampala Fintech Lab"
            aria-invalid={Boolean(errors.employer)}
            aria-describedby={describedBy('employer')}
          />
        </Field>

        <Field
          id="description"
          label="What the work involves"
          required
          error={errors.description}
          className="field-wide"
          hint="A short, plain description is enough."
        >
          <textarea
            id="description"
            className="input textarea"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={describedBy('description')}
          />
        </Field>

        <Field
          id="requiredSkills"
          label="Required skills"
          required
          error={errors.requiredSkills}
          className="field-wide"
          hint="Separate skills with commas. These decide most of the match."
        >
          <input
            id="requiredSkills"
            className="input"
            value={requiredSkills}
            onChange={(event) => setRequiredSkills(event.target.value)}
            placeholder="React, TypeScript, CSS, Git"
            aria-invalid={Boolean(errors.requiredSkills)}
            aria-describedby={describedBy('requiredSkills')}
          />
        </Field>

        <Field
          id="niceToHaveSkills"
          label="Nice to have"
          className="field-wide"
          hint="Optional. Shown to candidates but not scored."
        >
          <input
            id="niceToHaveSkills"
            className="input"
            value={niceSkills}
            onChange={(event) => setNiceSkills(event.target.value)}
            placeholder="Figma, REST APIs"
          />
        </Field>

        <Field
          id="location"
          label="Location"
          required
          error={errors.location}
          hint="City, or type Remote."
        >
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

        <Field id="workType" label="Work type">
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

        <Field
          id="minYearsExperience"
          label="Minimum years of experience"
          error={errors.minYearsExperience}
          hint="Use 0 when there is no minimum."
        >
          <input
            id="minYearsExperience"
            className="input"
            type="number"
            min={0}
            max={40}
            step={1}
            value={minYears}
            onChange={(event) => setMinYears(event.target.value)}
            aria-invalid={Boolean(errors.minYearsExperience)}
            aria-describedby={describedBy('minYearsExperience')}
          />
        </Field>

        <Field id="startNeed" label="When you need someone">
          <select
            id="startNeed"
            className="input select"
            value={startNeed}
            onChange={(event) => setStartNeed(event.target.value as StartNeed)}
          >
            {START_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
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
