// tools/verify.mjs — real-browser verification rig for muhyo.uz
// Drives chrome-headless-shell (Chromium) via puppeteer-core:
// screenshots at 320/768/1024/1440 × light/dark × JS enabled/disabled,
// axe-core audit, console/pageerror/request-failure capture, LCP/CLS under Slow-4G + 4× CPU.
//
// Setup:
//   npx @puppeteer/browsers install chrome-headless-shell@stable --path .firecrawl/browsers
//   mkdir .firecrawl/verify && cd .firecrawl/verify && npm init -y && npm i puppeteer-core axe-core
//   cd ../..  (repo root)
// Run (serves the repo root — https://localhost not needed):
//   python3 -m http.server 8137 &
//   CHROME_PATH=$(find .firecrawl/browsers -name chrome-headless-shell -type f) \
//   node tools/verify.mjs /            # or /essays.html
//
// Output: JSON report on stdout + PNGs in .firecrawl/verify/shots/
import puppeteer, { PredefinedNetworkConditions } from 'puppeteer-core';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BIN = process.env.CHROME_PATH;
if (!BIN) { console.error('Set CHROME_PATH to the chrome-headless-shell binary'); process.exit(1); }
const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:8137';
const route = process.argv[2] ?? '/';
const SHOT_DIR = process.env.SHOT_DIR ?? '.firecrawl/verify/shots';

let axeSrc;
try { axeSrc = readFileSync(resolve('.firecrawl/verify/node_modules/axe-core/axe.min.js'), 'utf8'); }
catch { axeSrc = readFileSync(resolve('node_modules/axe-core/axe.min.js'), 'utf8'); }

const widths = [320, 768, 1024, 1440];
const slug = route === '/' ? 'index' : route.replace(/\W+/g, '-').replace(/^-|-$/g, '');
const browser = await puppeteer.launch({ executablePath: BIN, headless: 'shell', args: ['--no-sandbox', '--disable-gpu'] });

const consoleErrors = [], pageErrors = [], requestFailures = [];
const wire = (page) => {
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => pageErrors.push(String(e)));
  page.on('requestfailed', (r) => requestFailures.push(`${r.url()} → ${r.failure()?.errorText}`));
  page.on('response', (r) => { if (r.status() >= 400) requestFailures.push(`${r.url()} → HTTP ${r.status()}`); });
};

for (const scheme of ['light', 'dark']) {
  for (const width of widths) {
    const page = await browser.newPage();
    wire(page);
    await page.setViewport({ width, height: 900, deviceScaleFactor: 2 });
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }]);
    await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: `${SHOT_DIR}/${slug}-${scheme}-${width}.png`, fullPage: true });
    await page.close();
  }
}

for (const scheme of ['light', 'dark']) {
  for (const width of widths) {
    const page = await browser.newPage();
    wire(page);
    await page.setJavaScriptEnabled(false);
    await page.setViewport({ width, height: 900, deviceScaleFactor: 2 });
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }]);
    await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.screenshot({ path: `${SHOT_DIR}/nojs-${scheme}-${width}.png`, fullPage: true });
    await page.close();
  }
}

const axeReports = {};
for (const scheme of ['light', 'dark']) {
  const page = await browser.newPage();
  wire(page);
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }]);
  await page.goto(BASE + route, { waitUntil: 'networkidle0' });
  await page.evaluate(axeSrc);
  axeReports[scheme] = await page.evaluate(async () => {
    const results = await window.axe.run(document, { resultTypes: ['violations'] });
    return results.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help }));
  });
  await page.close();
}

const page = await browser.newPage();
wire(page);
await page.setViewport({ width: 1440, height: 900 });
await page.emulateNetworkConditions(PredefinedNetworkConditions['Slow 4G']);
await page.emulateCPUThrottling(4);
await page.goto(BASE + route, { waitUntil: 'load', timeout: 60000 });
await new Promise(r => setTimeout(r, 2500));
const perf = await page.evaluate(() => new Promise((resolve) => {
  const out = { lcp: null, cls: 0 };
  new PerformanceObserver((list) => { const e = list.getEntries(); out.lcp = Math.round(e[e.length - 1].startTime); })
    .observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((list) => { for (const e of list.getEntries()) if (!e.hadRecentInput) out.cls += e.value; out.cls = Number(out.cls.toFixed(4)); })
    .observe({ type: 'layout-shift', buffered: true });
  setTimeout(() => resolve(out), 1200);
}));
await page.close();
await browser.close();

console.log(JSON.stringify({ route, consoleErrors, pageErrors, requestFailures, axe: axeReports, perf }, null, 2));
