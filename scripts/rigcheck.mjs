// R-LIB-05 capture: every item × three body extremes, framed on its slot. Writes PNGs + per-slot contact sheets.
// Usage: node scripts/rigcheck.mjs [baseUrl] [outDir]   (dev server must be running)
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const base = process.argv[2] ?? 'http://localhost:5173/';
const out = process.argv[3] ?? 'rigcheck-out';
const only = (process.argv[4] ?? '').split(',').filter(Boolean);
mkdirSync(out, { recursive: true });
const BODIES = [
  ['m11', { sex: 'male', height: 1, musculature: 1 }],
  ['f00', { sex: 'female', height: 0, musculature: 0 }],
  ['f11', { sex: 'female', height: 1, musculature: 1 }],
];
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 900, height: 900 }, deviceScaleFactor: 1 });
await page.goto(base);
await page.waitForFunction(() => !!window.__suitforge?.bridge.gl);
await page.addStyleTag({ content: '.overlay{display:none!important}' });
const slots = await page.evaluate(() => Object.keys(window.__suitforge.store.getState().character.loadout));
const items = await page.evaluate(() => window.__suitforge.registry.all.map((i) => ({ id: i.id, slot: i.slot, name: i.name })));
const manifest = [];
for (const slot of slots) {
  if (only.length && !only.includes(slot)) continue;
  for (const item of items.filter((i) => i.slot === slot)) {
    for (const [tag, body] of BODIES) {
      await page.evaluate(({ slot, id, body }) => {
        const s = window.__suitforge.store.getState();
        const base = { helmet: null, headgear: null, glasses: null, neck: null, torso: 'torso.undersuit', back: null, bracers: null, gloves: null, weapon: null, legs: 'legs.undersuit', boots: null };
        s.load({ ...s.character, loadout: { ...base, [slot]: id }, body: { ...s.character.body, ...body } }, { history: false });
        s.setUi({ autoRotate: false, idleAnim: false, activeSlot: null });
      }, { slot, id: item.id, body });
      await page.waitForTimeout(120); // let metrics update before framing
      await page.evaluate(({ slot }) => {
        const s = window.__suitforge.store.getState();
        s.setUi({ activeSlot: slot, cameraNonce: s.ui.cameraNonce + 1 });
      }, { slot });
      await page.waitForTimeout(750);
      const file = `${out}/${item.id}__${tag}.png`;
      await page.screenshot({ path: file, clip: { x: 0, y: 90, width: 900, height: 720 } });
      manifest.push({ slot, id: item.id, name: item.name, tag, file });
    }
  }
  console.log(`captured ${slot}`);
}
writeFileSync(`${out}/manifest.json`, JSON.stringify(manifest, null, 1));
await browser.close();
execSync(`python3 scripts/rigcheck-sheets.py ${out}`, { stdio: 'inherit' });
