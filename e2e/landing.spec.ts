import { expect, test } from '@playwright/test';

const REPO = 'https://github.com/devanshrawat27/relaycheck-web';

test('the public landing explains the product with working destinations', async ({ page }) => {
  await page.goto('/welcome');

  await expect(
    page.getByRole('heading', { level: 1, name: /webhooks should just work/i }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: /test the failures that matter/i })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /a simple workflow, complete visibility/i }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /a verdict you can inspect/i }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: /built for the person on call/i })).toBeVisible();

  await expect(page.getByRole('link', { name: /run your first test/i }).first()).toHaveAttribute(
    'href',
    '/runs/new',
  );
  await expect(page.getByRole('link', { name: /explore on github/i })).toHaveAttribute(
    'href',
    REPO,
  );
  await expect(page.getByRole('link', { name: /get started/i })).toHaveAttribute(
    'href',
    '/register',
  );

  await expect(page.getByText(/illustrative example data/i).first()).toBeVisible();
  await expect(page.getByText(/open source/i)).toHaveCount(0);
});

test('the landing does not overflow a 390px viewport and the menu works', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/welcome');

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);

  await page.getByRole('button', { name: /open menu/i }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile' })).toBeVisible();
  await page.getByRole('navigation', { name: 'Mobile' }).getByRole('link', { name: 'Product' }).click();
  await expect(page.locator('#product')).toBeVisible();
});
