import { chromium } from 'playwright-core';

const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const base = process.env.BASE_URL || 'https://q-sourcing.vercel.app';

const browser = await chromium.launch({ executablePath: chrome, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const delayPattern = /(EmployerHome|CandidateHome|GigDetail|Profile)-.*\.js/;
await page.route(delayPattern, async (route) => {
  await new Promise((r) => setTimeout(r, 2500));
  await route.continue();
});

let ok = 0;
let fail = 0;
const check = (name, pass, extra = '') => {
  if (pass) ok += 1;
  else fail += 1;
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${extra ? `  ${extra}` : ''}`);
};

const shots = [
  { path: '/employer', shot: '.shots/skeleton-live-home.png', chunk: /EmployerHome-/ },
  { path: '/candidate/gigs/gig-frontend', shot: '.shots/skeleton-live-detail.png', chunk: /CandidateGig-/ },
  { path: '/candidate/profile', shot: '.shots/skeleton-live-form.png', chunk: /CandidateProfile-/ },
];

for (const item of shots) {
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p.route(item.chunk, async (route) => {
    await new Promise((r) => setTimeout(r, 2500));
    await route.continue();
  });
  await p.goto(base + item.path, { waitUntil: 'commit' });
  try {
    await p.waitForSelector('.skeleton-screen', { timeout: 20000 });
    await p.waitForTimeout(450);

    const visible = await p.evaluate(() => {
      const el = document.querySelector('.skeleton-screen');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const blocks = el.querySelectorAll('.sk').length;
      let shimmering = 0;
      el.querySelectorAll('.sk').forEach((b) => {
        const after = getComputedStyle(b, '::after');
        if (after.animationName === 'shimmer' || after.backgroundImage !== 'none') shimmering += 1;
      });
      const labels = ['Loading page'];
      const srOnly = labels.every((t) => el.textContent.includes(t));
      return { opacity: Number(cs.opacity), height: Math.round(r.height), blocks, shimmering, srOnly };
    });

    check(`${item.path} skeleton visible`, !!visible && visible.height > 120 && visible.opacity > 0.79, JSON.stringify(visible));
    check(`${item.path} shimmer blocks animate`, !!visible && visible.blocks >= 6 && visible.shimmering === visible.blocks, JSON.stringify(visible));
    await p.screenshot({ path: item.shot });

    await p.waitForSelector('.hero, .gig-card, .detail-title, form.panel, .form-panel, h1', { timeout: 25000 });
    check(`${item.path} real content replaced skeleton`, (await p.locator('.skeleton-screen').count()) === 0);
  } catch (err) {
    fail += 1;
    console.log(`FAIL  ${item.path}  ${err.message.split('\n')[0]}`);
  }
  await p.close();
}

console.log(`\n${ok} passed, ${fail} failed`);
await browser.close();
process.exit(fail ? 1 : 0);
