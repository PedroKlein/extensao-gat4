/**
 * Screenshot + console capture script using Playwright.
 * Takes screenshots at multiple viewports and interaction states.
 * Run: npm run screenshot (requires dev server running at localhost:5173)
 */

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';

const BASE_URL = 'http://localhost:5173';
const OUT_DIR = resolve(dirname(new URL(import.meta.url).pathname), '../screenshots');

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 900 },
];

interface ConsoleEntry {
  timestamp: string;
  type: string;
  text: string;
}

async function safeClick(_page: import('playwright').Page, locator: import('playwright').Locator, label: string): Promise<boolean> {
  try {
    await locator.click({ force: true, timeout: 3000 });
    return true;
  } catch {
    console.log(`  ⚠ ${label} (click failed — likely hidden or overlapped)`);
    return false;
  }
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const consoleMessages: ConsoleEntry[] = [];
  const browser = await chromium.launch({ headless: true });

  for (const vp of VIEWPORTS) {
    console.log(`\n📸 Viewport: ${vp.name} (${vp.width}x${vp.height})`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();

    // Capture console messages
    page.on('console', msg => {
      consoleMessages.push({
        timestamp: new Date().toISOString(),
        type: msg.type(),
        text: msg.text(),
      });
    });

    page.on('pageerror', err => {
      consoleMessages.push({
        timestamp: new Date().toISOString(),
        type: 'pageerror',
        text: `${err.message}`,
      });
    });

    // --- State 1: Default ---
    await page.goto(BASE_URL);
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `${OUT_DIR}/${vp.name}-01-default.png`, fullPage: false });
    console.log(`  ✓ 01-default`);

    // --- State 2: Patient selected ---
    const mapEl = page.locator('#map');
    const mapBox = await mapEl.boundingBox();
    if (mapBox) {
      await page.mouse.click(mapBox.x + mapBox.width * 0.45, mapBox.y + mapBox.height * 0.35);
      await page.waitForTimeout(2500);
      await page.screenshot({ path: `${OUT_DIR}/${vp.name}-02-patient-selected.png`, fullPage: false });
      console.log(`  ✓ 02-patient-selected`);
    }
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Collapse filters first (to unblock buttons on mobile)
    const filtersHeader = page.locator('#filters-header');
    if (await filtersHeader.isVisible()) {
      await safeClick(page, filtersHeader, 'collapse filters');
      await page.waitForTimeout(300);
    }

    // --- State 3: Heatmap ---
    const heatBtn = page.locator('#heatmap-toggle');
    if (await safeClick(page, heatBtn, '03-heatmap')) {
      await page.waitForTimeout(2000);
      await page.screenshot({ path: `${OUT_DIR}/${vp.name}-03-heatmap.png`, fullPage: false });
      console.log(`  ✓ 03-heatmap`);
      await safeClick(page, heatBtn, 'toggle heatmap off');
      await page.waitForTimeout(1000);
    }

    // --- State 4: Microáreas ---
    const microBtn = page.locator('button', { hasText: 'Microáreas' });
    if (await safeClick(page, microBtn, '04-microareas')) {
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${OUT_DIR}/${vp.name}-04-microareas.png`, fullPage: false });
      console.log(`  ✓ 04-microareas`);
      await safeClick(page, microBtn, 'toggle microareas off');
      await page.waitForTimeout(300);
    }

    // --- State 5: US marker panel ---
    const usMarker = page.locator('.leaflet-marker-icon').first();
    if (await safeClick(page, usMarker, '05-us-panel')) {
      await page.waitForTimeout(800);
      await page.screenshot({ path: `${OUT_DIR}/${vp.name}-05-us-panel.png`, fullPage: false });
      console.log(`  ✓ 05-us-panel`);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }

    // --- State 6: Filters collapsed ---
    // Expand first if we collapsed earlier
    if (await filtersHeader.isVisible()) {
      await safeClick(page, filtersHeader, 'expand filters');
      await page.waitForTimeout(300);
    }
    await page.screenshot({ path: `${OUT_DIR}/${vp.name}-06-filters-open.png`, fullPage: false });
    console.log(`  ✓ 06-filters-open`);

    await context.close();
  }

  await browser.close();

  // Write console log
  const warnings = consoleMessages.filter(m => m.type === 'warning' || m.type === 'error' || m.type === 'pageerror');
  const logContent = [
    `=== Console Capture ===`,
    `Total messages: ${consoleMessages.length}`,
    `Warnings: ${warnings.filter(m => m.type === 'warning').length}`,
    `Errors: ${warnings.filter(m => m.type === 'error' || m.type === 'pageerror').length}`,
    ``,
    `--- WARNINGS AND ERRORS ---`,
    ...warnings.map(m => `[${m.type.toUpperCase()}] ${m.text}`),
    ``,
    `--- ALL MESSAGES ---`,
    ...consoleMessages.map(m => `[${m.timestamp}] [${m.type}] ${m.text}`),
  ].join('\n');

  writeFileSync(`${OUT_DIR}/console.txt`, logContent, 'utf-8');
  console.log(`\n📋 Console: ${warnings.length} warnings/errors (${consoleMessages.length} total messages)`);
  console.log(`📁 Screenshots: ${OUT_DIR}/`);

  if (warnings.length > 0) {
    console.log('\n⚠️  Issues found:');
    for (const w of warnings.slice(0, 15)) {
      console.log(`  [${w.type}] ${w.text.slice(0, 150)}`);
    }
  }
}

main().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});
