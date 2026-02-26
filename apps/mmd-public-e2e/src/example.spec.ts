import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect there to be two h1 elements.
  expect(await page.locator('h1').count()).toBe(2);

  // Both h1 elements should contain the text 'MOCK MY DRAFT'.
  const h1Elements = await page.locator('h1').all();
  for (const h1Element of h1Elements) {
    expect(await h1Element.innerText()).toContain('MOCK MY DRAFT');
  }
});
