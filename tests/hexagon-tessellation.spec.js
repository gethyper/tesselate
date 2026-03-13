import { test, expect } from '@playwright/test';

test.describe('Hexagon Tessellation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for canvas to be rendered
    await page.waitForSelector('canvas');
  });

  test('should load hexagon tessellation page', async ({ page }) => {
    await expect(page).toHaveTitle(/tesselate/i);
    const canvas = await page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should change pattern', async ({ page }) => {
    // Open controls
    await page.click('text=TESSELLATIONS');

    // Change pattern
    await page.click('label:has-text("Pattern")');
    await page.click('text=Persian Knots');

    // Verify URL updated
    await expect(page).toHaveURL(/pattern=persianKnots/);
  });

  test('should change theme', async ({ page }) => {
    // Open controls
    await page.click('text=TESSELLATIONS');

    // Change theme
    await page.click('label:has-text("Theme")');
    await page.click('text=Electric Sheep');

    // Verify URL updated
    await expect(page).toHaveURL(/theme=Electric.*Sheep/);
  });

  test('should change tile size', async ({ page }) => {
    // Open controls
    await page.click('text=TESSELLATIONS');

    // Change size
    const sizeInput = page.locator('input[type="number"]').first();
    await sizeInput.fill('30');

    // Wait for debounce
    await page.waitForTimeout(300);

    // Verify URL updated
    await expect(page).toHaveURL(/size=30/);
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

  test('should handle minimum size constraints', async ({ page }) => {
    // Open controls
    await page.click('text=TESSELLATIONS');

    // Try to set size below minimum
    const sizeInput = page.locator('input[type="number"]').first();
    await sizeInput.fill('3');

    // Wait for debounce
    await page.waitForTimeout(300);

    // Verify it clamped to minimum of 5
    await expect(page).toHaveURL(/size=5/);
  });

  test('should auto-rotate patterns when not interacted', async ({ page }) => {
    // Get initial URL
    const initialUrl = page.url();

    // Wait for auto-rotation (10 seconds)
    await page.waitForTimeout(11000);

    // URL should have changed (pattern or theme changed)
    const newUrl = page.url();
    expect(newUrl).not.toBe(initialUrl);
  });

  test('should stop auto-rotation on user interaction', async ({ page }) => {
    // Open controls (user interaction)
    await page.click('text=TESSELLATIONS');

    const urlBeforeWait = page.url();

    // Wait for what would be auto-rotation time
    await page.waitForTimeout(11000);

    // URL should NOT have changed because user interacted
    const urlAfterWait = page.url();
    expect(urlAfterWait).toBe(urlBeforeWait);
  });
});
