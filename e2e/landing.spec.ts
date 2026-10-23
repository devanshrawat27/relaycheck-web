import { expect, test } from '@playwright/test';

test('the public landing explains the evidence and points at real routes', async ({ page }) => {
  await page.goto('/welcome');

  await expect(
    page.getByRole('heading', { level: 1, name: /duplicate deliveries/i }),
  ).toBeVisible();
  await expect(page.getByText(/illustrative example data/i).first()).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /a run is more than a status code/i }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: /the verdict is the effect count/i })).toBeVisible();

  await expect(page.getByRole('link', { name: /open the dashboard/i }).first()).toHaveAttribute(
    'href',
    '/',
  );
  await expect(page.getByRole('link', { name: /create an account/i }).first()).toHaveAttribute(
    'href',
    '/register',
  );
});

test('the landing does not overflow a 390px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/welcome');

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
