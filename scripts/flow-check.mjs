import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const executablePath =
  process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const base = process.env.BASE_URL || 'http://localhost:5173';
const shots = 'C:/Users/U S  E  R/Documents/projects/expo/.shots';
const results = [];

function check(name, fn) {
  return Promise.resolve()
    .then(fn)
    .then(() => {
      results.push(`PASS  ${name}`);
    })
    .catch((error) => {
      results.push(`FAIL  ${name} -> ${error.message}`);
    });
}

const browser = await chromium.launch({ executablePath, headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const pageErrors = [];
page.on('pageerror', (error) => pageErrors.push(error.message));
page.on('console', (message) => {
  if (message.type() === 'error') pageErrors.push(message.text());
});

await check('employer home lists three seeded gigs', async () => {
  await page.goto(`${base}/employer`, { waitUntil: 'load' });
  await page.waitForSelector('.gig-card');
  assert.equal(await page.locator('.gig-card').count(), 3);
});

await check('empty gig form shows a field-level error for each required field', async () => {
  await page.getByRole('button', { name: 'Post a gig' }).click();
  await page.getByRole('button', { name: 'Post gig' }).click();
  await page.waitForSelector('.banner-error');
  assert.equal(await page.locator('.field-msg').count(), 5);
  assert.equal(await page.locator('[aria-invalid="true"]').count(), 5);
  await page.screenshot({ path: `${shots}/desktop-gig-form-errors.png`, fullPage: true });
});

await check('a valid gig saves and opens its match list', async () => {
  await page.fill('#title', 'Junior React Developer');
  await page.fill('#employer', 'Demo Employer Ltd');
  await page.fill('#description', 'Build internal tools with the product team. One-year contract with a possible extension.');
  await page.fill('#requiredSkills', 'React, TypeScript');
  await page.fill('#location', 'Kampala');
  await page.getByRole('button', { name: 'Post gig' }).click();
  assert.equal(await page.locator('button[aria-busy="true"]').count(), 1, 'save button stays busy');
  assert.equal(await page.locator('button[aria-busy="true"] .spinner').count(), 1, 'spinner shows');
  await page.waitForURL(/\/employer\/gigs\/gig-/);
  await page.waitForFunction(() =>
    Boolean(document.querySelector('h1')?.textContent?.includes('Junior React Developer')),
  );
  assert.match(await page.locator('h1').innerText(), /Junior React Developer/);
  assert.equal(await page.locator('.match-row').count(), 2);
});

await check('shortlisting shows the candidate with no interest yet', async () => {
  await page.goto(`${base}/employer/gigs/gig-frontend`, { waitUntil: 'load' });
  await page.locator('.match-row').first().getByRole('button', { name: 'Shortlist' }).click();
  await page.waitForSelector('.shortlist');
  const text = await page.locator('.shortlist').innerText();
  assert.match(text, /Amina Nakato/);
  assert.match(text, /No interest yet/);
  await page.screenshot({ path: `${shots}/desktop-shortlist.png`, fullPage: true });
});

await check('candidate profile shows a four-part explanation', async () => {
  await page.locator('.match-actions a', { hasText: 'View profile' }).first().click();
  await page.waitForURL(/\/candidates\/cand-amina/);
  await page.waitForSelector('.breakdown li');
  assert.equal(await page.locator('.breakdown li').count(), 4);
  const text = await page.locator('.breakdown').innerText();
  assert.match(text, /Has all 4 required skills/);
  assert.match(text, /Based in Kampala/);
  await page.screenshot({ path: `${shots}/desktop-candidate-detail.png`, fullPage: true });
});

await check('candidate view can express interest', async () => {
  await page.getByRole('button', { name: 'Open candidate view' }).click();
  await page.waitForURL(/\/candidate\/gigs\/gig-frontend/);
  await page.getByRole('button', { name: 'Express interest' }).click();
  await page.waitForSelector('.status-block');
  assert.match(await page.locator('.status-block').innerText(), /Interest sent/);
  assert.equal(await page.getByRole('link', { name: 'Back to employer shortlist' }).count(), 1);
  await page.screenshot({ path: `${shots}/desktop-interest-sent.png`, fullPage: true });
});

await check('employer shortlist shows the interest status', async () => {
  await page.getByRole('link', { name: 'Back to employer shortlist' }).click();
  await page.waitForURL(/\/employer\/gigs\/gig-frontend/);
  const shortlist = await page.locator('.shortlist').innerText();
  assert.match(shortlist, /Expressed interest/);
  assert.match(shortlist, /29 Oct/);
  assert.equal(await page.locator('.match-row .status-yes').count(), 1);
});

await check('changing requirements to an impossible skill shows the empty state', async () => {
  await page.getByRole('button', { name: 'Edit requirements' }).click();
  await page.fill('#requiredSkills', 'COBOL, Fortran');
  await page.fill('#location', 'Gulu');
  await page.getByRole('button', { name: 'Save requirements' }).click();
  await page.waitForSelector('.empty-state h3');
  assert.match(await page.locator('.empty-state h3').innerText(), /No suitable candidates/);
  assert.equal(await page.getByRole('button', { name: /Show all 6 candidates/ }).count(), 1);
  await page.screenshot({ path: `${shots}/desktop-no-match.png`, fullPage: true });
});

await check('showing all candidates still reveals low scorers', async () => {
  await page.getByRole('button', { name: /Show all 6 candidates/ }).click();
  await page.waitForSelector('.match-row');
  assert.equal(await page.locator('.match-row').count(), 6);
});

await check('candidate profile validation names each missing field', async () => {
  await page.goto(`${base}/candidate/profile/new`, { waitUntil: 'load' });
  await page.getByRole('button', { name: 'Save profile' }).click();
  await page.waitForSelector('.banner-error');
  assert.equal(await page.locator('.field-msg').count(), 4);
});

await check('new candidate profile is saved and becomes the active profile', async () => {
  await page.fill('#name', 'Test Candidate');
  await page.fill('#headline', 'Customer support agent');
  await page.fill('#skills', 'Customer service, POS');
  await page.fill('#yearsExperience', '1');
  await page.fill('#location', 'Kampala');
  await page.getByRole('button', { name: 'Save profile' }).click();
  await page.waitForURL(`${base}/candidate`);
  assert.match(await page.locator('.profile-card h2').innerText(), /Test Candidate/);
  assert.equal(await page.locator('.opp-row').count(), 4);
});

await check('state persists after a reload', async () => {
  await page.reload({ waitUntil: 'load' });
  assert.match(await page.locator('.profile-card h2').innerText(), /Test Candidate/);
  const stored = await page.evaluate(() => localStorage.getItem('careerexpo2026.v1'));
  assert.ok(stored && stored.includes('Test Candidate'));
});

await check('no runtime console errors', async () => {
  assert.deepEqual(pageErrors, []);
});

console.log(results.join('\n'));
const failed = results.filter((line) => line.startsWith('FAIL')).length;
console.log(`\n${results.length - failed} passed, ${failed} failed`);
await browser.close();
process.exit(failed > 0 ? 1 : 0);
