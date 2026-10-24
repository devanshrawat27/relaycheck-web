import { expect, Page, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

const PASSWORD = 'correct-horse-battery';

function uniqueEmail(): string {
  return `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.test`;
}

async function register(page: Page): Promise<string> {
  const email = uniqueEmail();
  await page.goto('/register');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Create your workspace' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'Evidence for every delivery.' })).toBeVisible();
  return email;
}

async function startDuplicateRun(page: Page): Promise<void> {
  await page.goto('/runs/new');
  await page.getByRole('radio', { name: /Duplicate delivery/ }).check();
  await page.getByRole('button', { name: /Start run/ }).click();
  await expect(page).toHaveURL(/\/$/);
}

async function waitForFirstRunStatus(page: Page, status: string): Promise<void> {
  await expect
    .poll(
      async () => {
        await page.goto('/');
        return page.getByText(status, { exact: true }).count();
      },
      { timeout: 60_000, intervals: [1000, 2000, 3000] },
    )
    .toBeGreaterThan(0);
}

test('unauthenticated visitors see the landing at / and /runs requires sign in', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { level: 1, name: /ship webhook integrations with confidence/i }),
  ).toBeVisible();

  await page.goto('/runs');
  await expect(page).toHaveURL(/\/login/);
});

test('register, run the duplicate scenario, and inspect passed evidence', async ({ page }) => {
  await register(page);
  await startDuplicateRun(page);
  await waitForFirstRunStatus(page, 'Passed');

  await page.locator('tbody tr').first().getByRole('link').first().click();
  await expect(page.getByRole('heading', { name: 'duplicate_delivery' })).toBeVisible();
  await expect(page.getByText('Assertions', { exact: true })).toBeVisible();
  await expect(page.getByText('business_effect_applied_once')).toBeVisible();
  await expect(page.getByText('delivery_attempt_count')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'deliveries_accepted' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Delivery attempts' })).toBeVisible();
});

test('an assertion failure is shown distinctly from an execution error', async ({ page, request }) => {
  await register(page);

  await request.post('http://127.0.0.1:3100/api/__test__/faults', {
    data: { mode: 'error', httpStatus: 503 },
  });

  try {
    await startDuplicateRun(page);
    await waitForFirstRunStatus(page, 'Failed');

    await page.locator('tbody tr').first().getByRole('link').first().click();
    await expect(page.getByRole('heading', { name: 'duplicate_delivery' })).toBeVisible();
    await expect(page.getByText('Assertion failure')).toBeVisible();
    await expect(page.getByText('Failed', { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('cell', { name: 'deliveries_accepted' })).toBeVisible();
    await expect(page.getByText('Execution error')).toHaveCount(0);
  } finally {
    await request.delete('http://127.0.0.1:3100/api/__test__/faults');
  }
});



