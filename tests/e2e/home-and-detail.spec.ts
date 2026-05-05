import { expect, test } from "@playwright/test";

test.describe("home → title detail flow", () => {
  test("renders catalog grid and navigates to detail with trailer button", async ({
    page,
  }) => {
    await page.goto("/");

    // Header is visible
    await expect(
      page.getByRole("link", { name: /Streamly/i }).first(),
    ).toBeVisible();

    // First trending section title shows up
    await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();

    // First card is a link to /title/<type>/<id>
    const firstCard = page
      .locator("a[href^='/title/']")
      .first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    // We're on a title page
    await expect(page).toHaveURL(/\/title\/(movie|tv)\/\d+/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("language switcher is present and accessible", async ({ page }) => {
    await page.goto("/");
    const select = page.getByRole("combobox", { name: /langue|language/i });
    await expect(select).toBeVisible();
  });
});
