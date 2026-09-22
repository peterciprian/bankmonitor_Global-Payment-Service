import { expect, test } from '@playwright/test';

test('retries a failed transfer with the same idempotency key', async ({ page }) => {
  const keys: string[] = [];
  let attempts = 0;

  await page.route('**/api/transfers', async (route) => {
    attempts += 1;
    keys.push(route.request().headers()['x-idempotency-key']);
    if (attempts === 1) {
      await route.abort('failed');
      return;
    }
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'transfer-e2e-1',
        fromAccountId: 1,
        toAccountId: 2,
        amount: 10,
        currency: 'EUR',
        status: 'COMPLETED',
        createdAt: new Date().toISOString()
      })
    });
  });

  await page.goto('/transfer');
  await page.locator('select[name="fromAccountId"]').selectOption('1');
  await page.locator('select[name="toAccountId"]').selectOption('2');
  await page.locator('input[name="amount"]').fill('10');
  await page.locator('select[name="currency"]').selectOption('EUR');
  await page.getByRole('button', { name: 'Submit transfer' }).click();

  await expect(page.getByText('The transfer request could not reach the server.')).toBeVisible();
  await page.getByRole('button', { name: 'Retry' }).click();
  await expect(page.getByText('Transfer completed successfully.')).toBeVisible();
  expect(attempts).toBe(2);
  expect(keys[0]).toBeTruthy();
  expect(keys[1]).toBe(keys[0]);
});