import { test, expect } from '@playwright/test';

test('shows login form', async ({ page }) => {
  await page.goto('/login');

  await expect(page.getByRole('button', { name: 'Log in', exact: true })).toBeVisible();
});
