import { expect, test } from "@playwright/test";

test.describe("genre pages", () => {
  test("genre page renders cards", async ({ page }) => {
    await page.goto("/genre/action");

    // Page heading contains genre name
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 10_000 });

    // At least one title card
    const cards = page.locator("a[href^='/title/']");
    await expect(cards.first()).toBeVisible({ timeout: 10_000 });
  });

  test("genres menu in header opens and navigates", async ({ page }) => {
    await page.goto("/");

    // Open the genres menu
    const genresBtn = page.getByRole("button", { name: /genres/i });
    await expect(genresBtn).toBeVisible();
    await genresBtn.click();

    // A genre link is visible
    const genreLink = page.getByRole("link", { name: /comedy|comédie/i });
    await expect(genreLink).toBeVisible();
    await genreLink.click();

    await expect(page).toHaveURL(/\/genre\/comedy/);
  });
});
