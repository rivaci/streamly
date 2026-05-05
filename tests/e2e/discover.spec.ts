import { expect, test } from "@playwright/test";

test.describe("discover page", () => {
  test("loads results with genre filter in URL", async ({ page }) => {
    await page.goto("/discover?type=movie&genres=28");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const cards = page.locator("a[href^='/title/']");
    await expect(cards.first()).toBeVisible({ timeout: 15_000 });

    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("genre chip toggles update the URL", async ({ page }) => {
    await page.goto("/discover?type=movie");

    // Click a genre chip (first genre button inside the genres fieldset)
    const genreBtn = page
      .locator("fieldset")
      .first()
      .locator("button[aria-pressed]")
      .first();
    await expect(genreBtn).toBeVisible({ timeout: 10_000 });
    await genreBtn.click();

    // URL should now contain a genres param
    await expect(page).toHaveURL(/genres=\d+/, { timeout: 10_000 });
  });
});
