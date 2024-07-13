import { test, expect } from '@playwright/test';

test('shows login form', async ({ page }) => {
  await page.goto('/');

  // Expect h1 to contain a substring.
  expect(await page.locator('button').innerText()).toContain('Log in');
});
