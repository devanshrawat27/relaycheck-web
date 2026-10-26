import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const SERIOUS_TAGS = ['wcag2a', 'wcag2aa'];

async function expectNoSeriousViolations(page: import('@playwright/test').Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(300);
  const results = await new AxeBuilder({ page }).withTags(SERIOUS_TAGS).analyze();
  const serious = results.violations.filter((v) =>
    ['serious', 'critical'].includes(v.impact ?? ''),
  );
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
}

test('the public landing page has no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expectNoSeriousViolations(page);
});

test('the sign-in page has no serious accessibility violations', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expectNoSeriousViolations(page);
});

test('the register page has no serious accessibility violations', async ({ page }) => {
  await page.goto('/register');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expectNoSeriousViolations(page);
});

test('the authenticated runs dashboard has no serious accessibility violations', async ({ page }) => {
  const email = `a11y-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@example.test`;
  await page.goto('/register');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('a11y-password-123');
  await page.getByRole('button', { name: 'Create your workspace' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'Webhook test runs' })).toBeVisible();
  await expectNoSeriousViolations(page);
});
