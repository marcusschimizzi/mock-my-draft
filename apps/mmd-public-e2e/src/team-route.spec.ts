import { test, expect } from '@playwright/test';

test('uses the team URL slug for both API queries', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));

  // Keep this routing regression independent of a live API or database.
  await page.route('**/api/**', async (route) => {
    const url = new URL(route.request().url());
    const body = url.pathname.endsWith('/draft-summary/years')
      ? (url.search ? { years: [] } : [2024])
      : null;
    await route.fulfill({ json: body });
  });

  const summary = page.waitForRequest((request) =>
    new URL(request.url()).pathname === '/api/draft-summary/2024/team/buffalo-bills',
  );
  const draftClass = page.waitForRequest((request) =>
    new URL(request.url()).pathname === '/api/draft-classes/2024/team/buffalo-bills',
  );

  await page.goto('/teams/buffalo-bills');
  await Promise.all([summary, draftClass]);
  expect(errors).toEqual([]);
});
