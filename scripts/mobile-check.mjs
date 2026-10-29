import { chromium } from 'playwright-core';

const executablePath =
  process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const base = process.env.BASE_URL || 'http://localhost:5173';
const browser = await chromium.launch({ executablePath, headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await page.goto(`${base}/employer/gigs/gig-frontend`, { waitUntil: 'networkidle' });
await page.screenshot({ path: 'C:/Users/U S  E  R/Documents/projects/expo/.shots/m390-employer-gig.png', fullPage: true });

const report = await page.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const offenders = [];
  document.querySelectorAll('*').forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.right > vw + 1 || rect.left < -1) {
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.getAttribute('class') || '').slice(0, 60),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
      });
    }
  });
  return {
    viewport: vw,
    scrollWidth: document.documentElement.scrollWidth,
    bodyScroll: document.body.scrollWidth,
    offenders: offenders.slice(0, 20),
  };
});
console.log(JSON.stringify(report, null, 2));

await page.goto(`${base}/candidate`, { waitUntil: 'networkidle' });
await page.screenshot({ path: 'C:/Users/U S  E  R/Documents/projects/expo/.shots/m390-candidate-home.png', fullPage: true });
console.log('candidate scrollWidth', await page.evaluate(() => document.documentElement.scrollWidth));

await page.goto(`${base}/employer`, { waitUntil: 'networkidle' });
await page.screenshot({ path: 'C:/Users/U S  E  R/Documents/projects/expo/.shots/m390-employer-home.png', fullPage: true });

await browser.close();
