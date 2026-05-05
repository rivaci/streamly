import { expect, test } from "@playwright/test";

test.describe("trending toggle", () => {
  test("toggling day/week updates URL", async ({ page }) => {
    await page.goto("/");

    // The toggle buttons exist
    const dayBtn = page.getByRole("button", { name: /aujourd.hui|today/i });
    await expect(dayBtn).toBeVisible({ timeout: 10_000 });

    await dayBtn.click();
    await expect(page).toHaveURL(/trending=day/);

    const weekBtn = page.getByRole("button", { name: /cette semaine|this week/i });
    await weekBtn.click();
    await expect(page).toHaveURL(/trending=week/);
  });
});
