// E2E smoke for SPEC §11 with the store test hook (window.__suitforge).
import { expect, test, type Page } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

const state = (page: Page) => page.evaluate(() => window.__suitforge!.store.getState());

test.beforeEach(async ({ page }) => {
  // fresh storage per test, but keep it across reloads within the test
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('e2e-cleared')) {
      localStorage.clear();
      sessionStorage.setItem('e2e-cleared', '1');
    }
  });
  await page.goto('/');
  await expect(page.getByTestId('rail')).toBeVisible();
  await page.waitForFunction(() => !!window.__suitforge?.bridge.gl);
});

test('loads the default hero with eleven slots (R-SLOT-01, R-CHAR-08)', async ({ page }) => {
  const rows = page.locator('[data-testid^="slot-"]');
  await expect(rows).toHaveCount(11);
  await expect(page.getByTestId('name-input')).toHaveValue('Vanguard Prime');
  const s = await state(page);
  expect(s.character.loadout.torso).toBeTruthy();
});

test('selecting a slot opens the drawer with ≥ 8 cards; hover previews; click equips; undo reverts (R-UI-03, R-UI-07)', async ({
  page,
}) => {
  await page.getByRole('button', { name: /^Helmet:/ }).click();
  const drawer = page.getByTestId('drawer');
  await expect(drawer).toHaveClass(/open/);
  const cards = drawer.locator('.card:not(.none)');
  expect(await cards.count()).toBeGreaterThanOrEqual(8);
  const before = (await state(page)).character.loadout.helmet;
  const target = cards.filter({ hasNot: page.locator('.card-badge') }).first();
  await target.hover();
  const preview = (await state(page)).preview;
  expect(preview?.slot).toBe('helmet');
  expect(preview?.itemId).not.toBe(before);
  await target.click();
  const after = (await state(page)).character.loadout.helmet;
  expect(after).toBe(preview?.itemId);
  expect((await state(page)).preview).toBeNull();
  await page.getByTestId('undo').click();
  expect((await state(page)).character.loadout.helmet).toBe(before);
  await page.getByTestId('redo').click();
  expect((await state(page)).character.loadout.helmet).toBe(after);
});

test('randomise respects locks and share link round-trips (R-GEN-03, R-SAVE-03)', async ({
  page,
  context,
}) => {
  await page.getByRole('button', { name: 'Lock Torso' }).click();
  const before = (await state(page)).character;
  await page.getByTestId('randomise').click();
  const after = (await state(page)).character;
  expect(after.loadout.torso).toBe(before.loadout.torso);
  expect(after).not.toEqual(before);
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByTestId('share').click();
  const url = await page.evaluate(() => navigator.clipboard.readText());
  expect(url).toContain('#c=');
  const other = await context.newPage();
  await other.goto(url);
  await other.waitForFunction(() => !!window.__suitforge?.bridge.gl);
  const loaded = (await state(other)).character;
  expect(loaded).toEqual(after);
});

test('keyboard: arrows move slots and cycle items, Esc closes (R-UI-08)', async ({ page }) => {
  await page.keyboard.press('ArrowDown');
  expect((await state(page)).ui.activeSlot).toBe('helmet');
  await page.keyboard.press('ArrowDown');
  expect((await state(page)).ui.activeSlot).toBe('headgear');
  const before = (await state(page)).character.loadout.headgear;
  await page.keyboard.press('ArrowRight');
  expect((await state(page)).character.loadout.headgear).not.toBe(before);
  await page.keyboard.press('Escape');
  expect((await state(page)).ui.activeSlot).toBeNull();
});

test('body sliders and sex toggle never break the scene (R-CHAR-02)', async ({ page }) => {
  await page.getByRole('button', { name: 'Female' }).click();
  await page.getByLabel('Height').fill('1');
  await page.getByLabel('Musculature').fill('0');
  const s = await state(page);
  expect(s.character.body).toMatchObject({ sex: 'female', height: 1, musculature: 0 });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.waitForTimeout(300);
  expect(errors).toEqual([]);
});

test('saves persist across reload (R-SAVE-01, R-SAVE-02)', async ({ page }) => {
  await page.getByTestId('roll-name').click();
  const name = (await state(page)).character.name;
  await page.getByTestId('open-saves').click();
  await page.getByTestId('save-current').click();
  await expect(page.getByText('Saved', { exact: true })).toBeVisible();
  await page.reload();
  await page.waitForFunction(() => !!window.__suitforge?.bridge.gl);
  expect((await state(page)).character.name).toBe(name);
  await page.getByTestId('open-saves').click();
  await expect(page.getByTestId('saves-dialog').getByText(name)).toBeVisible();
});

test('accessibility: no serious violations at desktop (T-A11Y-01)', async ({ page }) => {
  await page.getByRole('button', { name: /^Torso:/ }).click();
  const results = await new AxeBuilder({ page }).exclude('canvas').analyze();
  const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
});

for (const [w, h] of [
  [1440, 900],
  [1024, 768],
  [390, 844],
] as const) {
  test(`renders at ${w}×${h} without horizontal overflow (T-COMPAT-02)`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.waitForTimeout(200);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
    await expect(page.getByTestId('topbar')).toBeVisible();
    await page.screenshot({ path: `test-results/viewport-${w}x${h}.png` });
  });
}
