# KaziLink: Talent and gig matching
Career Expo 2026 Live Employer Challenge (Q-Sourcing / FLIP Africa)

Live: https://q-sourcing.vercel.app

## Setup
npm install
npm run dev   # open http://localhost:5173
Data is seeded on first load and saved in the browser (localStorage).
Use "Reset demo data" in the footer to restore the samples.

## Sample data
6 fictional candidates: Amina Nakato, Brian Okello, Sarah Namusoke,
Daniel Mwangi, Grace Achieng, Peter Ssemakula.
3 fictional gigs: Frontend Developer (React), Social Media Manager,
Weekend Barista. None are real people or real vacancies.

## Matching rules
Every gig is scored 0-100 against every profile:
- Required skills (60%): share of required skills on the profile
- Availability (15%): can the candidate start by the gig's start date
- Location (15%): same city, or the gig is remote
- Experience (10%): meets the minimum years
A candidate is "suitable" at 65% or more AND with at least half of the
required skills. Nice-to-have skills are shown but not scored.
Each match lists which checks passed and failed in plain language.

## Limitations
- Skills match by keyword, so synonyms ("JS" vs "JavaScript") can miss
- Profiles are self-reported and not verified
- Cannot judge attitude, references or work samples
- Data lives in one browser; there are no accounts or shared database
- Scores support human review and do not guarantee suitability
