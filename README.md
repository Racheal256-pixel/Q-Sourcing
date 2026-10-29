# KaziLink

Talent and gig matching demo for the Career Expo 2026 live employer challenge, Q-Sourcing and FLIP Africa.

Live demo: https://kazilink-swart.vercel.app

KaziLink has two connected views. An employer posts a gig and gets a ranked shortlist with a plain language reason for every match. A candidate creates a profile, sees the gigs that fit, and expresses interest. The employer sees that interest on the shortlist.

Built with React, TypeScript, Vite, and React Router. Data is stored in the browser by default. Firebase Firestore is supported as an optional shared backend.

## Run it

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:5173. The app opens on the employer view.

If you deploy the built app to a static host, configure it to serve `index.html` for unknown paths so the routes work on refresh. The included `vercel.json` does this for Vercel.

Production build:

```bash
npm run build
npm run preview
```

## Five minute demo

The app ships with fictional data so the demo works offline. Use the button at the bottom of the page, Reset demo data, before you start.

1. Employer view. The gig list shows live counts. Open Frontend Developer (React).
2. Point at the two suitable candidates. Amina Nakato scores 100% because she has all four required skills, is in Kampala, is available immediately, and has three years of experience. Brian Okello scores 85% because he is missing CSS and starts in two weeks, which still fits.
3. Click Shortlist on Amina. The shortlist panel on the right now shows her with "No interest yet".
4. Click View profile. The breakdown shows 60/60 skills, 15/15 availability, 15/15 location, 10/10 experience. Then click Open candidate view.
5. On the candidate page, click Express interest. The panel confirms the interest was sent and shows when. Click Back to employer shortlist.
6. The shortlist now shows "Expressed interest" with the date and time, and Amina carries an Interested badge in the match list.
7. To show the empty state, click Edit requirements, change Required skills to "COBOL, Fortran" and Location to "Gulu", then Save requirements. No candidate clears the bar, so the page explains why, names the closest profile, and offers Show all 6 candidates.
8. To show validation, go back to All gigs, click Post a gig, and press Post gig with empty fields. Every required field gets its own message and the banner links to each one.

Reset demo data afterwards so the next run starts clean.

## Sample data

All names, employers, and gigs are fictional.

Candidates:

| Candidate | Skills | Years | Location | Availability |
| --- | --- | --- | --- | --- |
| Amina Nakato | React, TypeScript, CSS, Git, Figma | 3 | Kampala | Immediately |
| Brian Okello | React, TypeScript, Node.js, SQL, Git | 4 | Kampala | Within 2 weeks |
| Sarah Namusoke | Figma, CSS, HTML, Design systems | 2 | Kampala | Within a month |
| Daniel Mwangi | Python, SQL, Excel, Dashboards | 2 | Nairobi | Immediately |
| Grace Achieng | Content writing, Instagram, Canva, Analytics, Photography | 3 | Kampala | Immediately |
| Peter Ssemakula | Barista experience, Customer service, POS, Stock counting | 2 | Kampala | Within 2 weeks |

Gigs:

| Gig | Employer | Required skills | Location | Start | Minimum years |
| --- | --- | --- | --- | --- | --- |
| Frontend Developer (React) | Kampala Fintech Lab | React, TypeScript, CSS, Git | Kampala | Within 2 weeks | 2 |
| Social Media Manager | Ntinda Coffee Co. | Content writing, Instagram, Canva | Remote | Within a month | 1 |
| Weekend Barista | Kololo Roasters | Customer service, Barista experience, POS | Kampala | Immediately | 1 |

One seeded expression of interest exists: Grace Achieng for Social Media Manager. That makes the interest status visible before the demo starts.

## How matching works

Every candidate is scored against every gig on four checks.

| Check | Weight | Rule |
| --- | --- | --- |
| Required skills | 60 | Share of required skills found on the profile. Exact word match, ignoring case and extra spaces. |
| Availability | 15 | Full points when the candidate can start by the date the gig needs. Immediately counts as 0 days, within 2 weeks as 14, within a month as 30. A flexible gig accepts any start. |
| Location | 15 | Full points for the same city, or when either the gig or the candidate is Remote. |
| Experience | 10 | Full points at or above the minimum. Partial points below the minimum, proportional to the shortfall. |

The score is the sum, rounded and capped at 100.

A candidate is shown as suitable when the score is 65 or more and they have at least half of the required skills. Everyone else is hidden behind "Show all", so a wrong match cannot quietly pad the shortlist. Bands are labels only: 80 and above is a Strong match, 65 and above is Good, 40 and above is Stretch, below 40 is Low.

Worked examples for Frontend Developer (React), which needs four skills, two years of experience, and a start within two weeks:

- Amina Nakato: 4 of 4 skills (60) + available immediately (15) + Kampala (15) + 3 years (10) = 100, Strong.
- Brian Okello: 3 of 4 skills (45) + start in two weeks (15) + Kampala (15) + 4 years (10) = 85, Strong. The missing skill is CSS.
- Sarah Namusoke: 1 of 4 skills (15) + available within a month (0) + Kampala (15) + 2 years (10) = 40, not suitable because she has fewer than two required skills.

Every screen shows the same reasons and gaps the score is built from. The score supports a human decision. It is not a claim that the candidate will do the job well.

## Limitations

- Skills are matched by exact wording. "React" and "React Native" are different skills here. A production version should use a skill taxonomy or embeddings.
- Availability is three coarse bands. There are no calendars, notice periods, or shift patterns.
- Location is a city name or Remote. There is no distance, travel time, or relocation support.
- There are no accounts, logins, or separate employer workspaces. The prototype runs one shared demo workspace.
- Interest is a single flag with a timestamp. There is no messaging, interview scheduling, or offer flow.
- The profile has no file uploads, references, or verification, so nothing on a profile is checked.
- Data lives in the browser. Clearing site data, or pressing Reset demo data, removes it.
- The optional Firebase sync is one shared Firestore document, so anyone who can open the site can change it. Use it for the demo only, never with real candidate data.

## Firebase sync

The app is local first so the demo cannot fail when the venue wifi is weak. Firestore is wired as an optional shared backend for the `flip-386f2` project.

Configuration comes from the `VITE_FIREBASE_*` build variables. They are set in the Vercel project for Production, Preview, and Development, and in `.env.development.local` for local work. `VITE_` values end up inside the built JavaScript, which is normal for a Firebase web app; the client config is not a secret.

The rules must allow the demo document, or every read and write is rejected:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /workspaces/career-expo-demo {
      allow read, write: if true;
    }
  }
}
```

Paste that in Firebase console, Firestore Database, Rules, then Publish. While the rules deny access the app logs one warning, `Firestore denied access, so this browser stays local`, and keeps everything in localStorage.

The app writes the whole workspace to `workspaces/career-expo-demo` and follows changes from other browsers. To point one browser at a different project without a rebuild, paste a config in the console; it overrides the build config:

```js
localStorage.setItem(
  'careerexpo2026.firebaseConfig',
  JSON.stringify({ apiKey: '…', projectId: 'your-project', appId: '…' })
);
location.reload();
```

Remove the override with `localStorage.removeItem('careerexpo2026.firebaseConfig')` and reload.

Anyone who can open the site can write to that document, so keep fictional data in it and lock the rules again after the event.

## Project layout

```
src/
  types.ts               shared types and option lists
  data/seed.ts           fictional candidates, gigs, seeded interest
  lib/matching.ts        scoring rules, bands, suitability threshold
  lib/store.ts           app state, actions, localStorage persistence
  lib/firebase.ts        optional Firestore mirror
  components/            layout, score ring, field, match breakdown, icons
  forms/                 gig form and candidate profile form, with validation
  pages/                 employer and candidate screens
  App.tsx                routes
  index.css              design tokens and layout
scripts/
  flow-check.mjs         end to end check of the demo journey
  mobile-check.mjs       layout overflow check at 390px
```

Routes:

- `/employer` gig list and post a gig
- `/employer/gigs/:gigId` ranked candidates, shortlist, edit requirements
- `/employer/gigs/:gigId/candidates/:candId` candidate profile and score breakdown
- `/candidate` candidate profile, ranked gigs, express interest
- `/candidate/profile` and `/candidate/profile/new` edit or create a profile
- `/candidate/gigs/:gigId` gig detail, score breakdown, express interest

## Checks

With the dev server running:

```bash
node scripts/flow-check.mjs
```

This runs 13 checks covering form validation, posting a gig, shortlisting, opening a candidate, expressing interest, the interest status returning to the employer, the no match empty state, showing all candidates, profile creation, reload persistence, and console errors. It uses the locally installed Chrome. Set `CHROME_PATH` if Chrome is somewhere else, and `BASE_URL` if the app is not on port 5173.

```bash
node scripts/mobile-check.mjs
```

This opens the app at 390px with mobile emulation, checks there is no horizontal overflow, and saves screenshots to `.shots`.

## Brief checklist

| Requirement | Where it is |
| --- | --- |
| Employer creates an opportunity | Post a gig on `/employer`, with field level validation |
| Employer sees relevant candidates | Ranked list on `/employer/gigs/:gigId` |
| Candidate finds an opportunity and expresses interest | `/candidate`, `/candidate/gigs/:gigId` |
| Each match explains its reasons | Reason lines, skill chips, and the score breakdown |
| Employer shortlists and sees interest status | Shortlist panel and candidate page |
| Empty state when nothing fits | Edit requirements to COBOL and Fortran, or post a narrow gig |
| Required fields are checked before saving | Gig form and profile form, 5 and 4 required checks |
| Fictional data only | Seed data is clearly fictional, and the footer says so |
