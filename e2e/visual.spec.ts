import { test, expect } from '@playwright/test';

/**
 * Pixel-level visual regression for the stable public pages. Reduced motion is
 * forced so reveal animations and the WebGL backdrop are disabled, keeping the
 * screenshots deterministic.
 *
 * These snapshots are platform-specific: the serif/sans font stacks render
 * differently on Windows vs Linux, so the baselines only match on the machine
 * that generated them. They are skipped in CI and intended as a local
 * visual-regression check. To regenerate: `npx playwright test e2e/visual.spec.ts --update-snapshots`.
 */
test.describe('visual regression', () => {
  test.skip(!!process.env.CI, 'pixel snapshots are platform-specific (font rendering); run locally');

  test.use({ viewport: { width: 1440, height: 900 } });

  test('sign-in page', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('sign-in.png', { fullPage: true });
  });

  test('register page', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('register.png', { fullPage: true });
  });
});
