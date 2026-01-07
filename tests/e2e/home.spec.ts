import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
    test('loads successfully with correct title', async ({ page }) => {
        await page.goto('/');

        // Wait for the page to be fully loaded
        await page.waitForLoadState('networkidle');

        // Check the page title contains "Home"
        await expect(page).toHaveTitle(/Home/);

        // Check that the Home link is visible
        await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    });

    test('page renders without JavaScript errors', async ({ page }) => {
        const errors: string[] = [];

        page.on('pageerror', (error) => {
            errors.push(error.message);
        });

        await page.goto('/');
        await page.waitForLoadState('networkidle');

        expect(errors).toHaveLength(0);
    });
});
