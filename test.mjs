import { chromium } from 'playwright';

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  
  console.log('Navigating to http://localhost:8081/signup');
  await page.goto('http://localhost:8081/signup', { waitUntil: 'networkidle' });
  console.log('Done waiting. Title:', await page.title());
  
  await browser.close();
})().catch(console.error);
