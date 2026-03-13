import { test, expect } from '@playwright/test';

test.describe('Grid Tessellation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/grid');
    // Wait for canvas to be rendered
    await page.waitForSelector('canvas');
  });

  test('should load grid tessellation page', async ({ page }) => {
    await expect(page).toHaveTitle(/tesselate/i);
    const canvas = await page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should change pattern', async ({ page }) => {
    // Open controls
    await page.click('text=TESSELLATIONS');

    // Change pattern
    await page.click('label:has-text("Pattern")');
    await page.click('text=Pinwheel');

    // Verify URL updated
    await expect(page).toHaveURL(/pattern=pinwheel/);
  });

  test('should change theme', async ({ page }) => {
    // Open controls
    await page.click('text=TESSELLATIONS');

    // Change theme
    await page.click('label:has-text("Theme")');
    await page.click('text=Chrome Dreams');

    // Verify URL updated
    await expect(page).toHaveURL(/theme=Chrome.*Dreams/);
  });

  test('should change tile size', async ({ page }) => {
    // Open controls
    await page.click('text=TESSELLATIONS');

    // Change width
    const widthInput = page.locator('input[type="number"]').first();
    await widthInput.fill('50');

    // Wait for debounce
    await page.waitForTimeout(300);

    // Verify URL updated
    await expect(page).toHaveURL(/width=50/);
  });

  test('should apply random adjustment', async ({ page }) => {
    // Open controls
    await page.click('text=TESSELLATIONS');

    // Select adjustment
    await page.click('label:has-text("Adjust")');
    await page.click('text=Wobble');

    // Wait for update
    await page.waitForTimeout(500);

    // Verify URL contains adjustment parameters
    await expect(page).toHaveURL(/tile_x_adjust=random/);
    await expect(page).toHaveURL(/tile_y_adjust=random/);
  });

  test('should apply wave adjustment', async ({ page }) => {
    // Open controls
    await page.click('text=TESSELLATIONS');

    // Select wave adjustment
    await page.click('label:has-text("Adjust")');
    await page.click('text=Wave X & Y');

    // Wait for update
    await page.waitForTimeout(500);

    // Verify URL contains wave parameters
    await expect(page).toHaveURL(/tile_x_adjust=wave/);
    await expect(page).toHaveURL(/tile_y_adjust=wave/);
  });

  test('should change adjustment amount', async ({ page }) => {
    // Open controls
    await page.click('text=TESSELLATIONS');

    // Select adjustment
    await page.click('label:has-text("Adjust")');
    await page.click('text=Shift X');

    // Change amount
    await page.click('label:has-text("Amount")');
    await page.click('text=5x');

    // Wait for update
    await page.waitForTimeout(500);

    // Verify URL updated with multiplied value
    const url = page.url();
    expect(url).toMatch(/tile_x_adjust/);
  });

  test('should change tile style', async ({ page }) => {
    // Open controls
    await page.click('text=TESSELLATIONS');

    // Change tile style
    await page.click('label:has-text("Tile Style")');
    await page.click('text=Circle');

    // Verify URL updated
    await expect(page).toHaveURL(/style=circle/);
  });

  test('should persist settings on refresh', async ({ page }) => {
    // Open controls and make changes
    await page.click('text=TESSELLATIONS');

    await page.click('label:has-text("Pattern")');
    await page.click('text=Basketweave');

    await page.click('label:has-text("Adjust")');
    await page.click('text=Wave X');

    await page.waitForTimeout(500);

    const url = page.url();

    // Refresh page
    await page.reload();
    await page.waitForSelector('canvas');

    // Verify URL is the same
    expect(page.url()).toBe(url);
  });

  test('should download image', async ({ page }) => {
    // Open controls
    await page.click('text=TESSELLATIONS');

    // Click download button
    await page.click('#download-button');

    // Verify download dialog appears
    await expect(page.locator('text=Download image')).toBeVisible();

    // Close dialog
    await page.click('button[aria-label="Close"]');
  });

  test('should handle minimum size constraints', async ({ page }) => {
    // Open controls
    await page.click('text=TESSELLATIONS');

    // Try to set width below minimum
    const widthInput = page.locator('input[type="number"]').first();
    await widthInput.fill('3');

    // Wait for debounce
    await page.waitForTimeout(300);

    // Verify it clamped to minimum of 5
    await expect(page).toHaveURL(/width=5/);
  });

  test('should load with URL parameters', async ({ page }) => {
    // Navigate with specific parameters
    await page.goto('/#/grid?pattern=chevron&width=20&height=20&theme=Chrome+Dreams&style=triangle-right&tile_x_adjust=random%3A100&tile_y_adjust=random%3A100');

    // Wait for canvas
    await page.waitForSelector('canvas');

    // Open controls to verify settings
    await page.click('text=TESSELLATIONS');

    // Verify pattern is correct
    const patternSelect = page.locator('label:has-text("Pattern")').locator('..');
    await expect(patternSelect).toContainText('Chevron');
  });
});
