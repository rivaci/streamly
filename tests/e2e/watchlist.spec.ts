import { expect, test } from "@playwright/test";

test.describe("watchlist flow", () => {
  test("add from home, view in /watchlist, remove", async ({ page }) => {
    await page.goto("/");

    // Wait for cards to render
    const firstCard = page.locator("a[href^='/title/']").first();
    await expect(firstCard).toBeVisible({ timeout: 15_000 });

    // Target the watchlist button inside the first card specifically
    const addBtn = firstCard.locator("button[aria-pressed]");
    await expect(addBtn).toBeVisible({ timeout: 10_000 });

    // Retry clicking until aria-pressed flips (guards against hydration delay)
    await expect(async () => {
      await addBtn.click();
      await expect(addBtn).toHaveAttribute("aria-pressed", "true", {
        timeout: 1_000,
      });
    }).toPass({ timeout: 10_000 });

    // Navigate to the watchlist page
    await page.goto("/watchlist");

    // There should be at least one title card
    const cards = page.locator("a[href^='/title/']");
    await expect(cards.first()).toBeVisible({ timeout: 10_000 });

    // Remove the item
    const removeBtn = page.locator("button[aria-pressed='true']").first();
    await removeBtn.click();

    // The list should now be empty — the empty message should appear
    await expect(
      page.getByText(/liste est vide|list is empty/i),
    ).toBeVisible({ timeout: 5_000 });
  });
});
