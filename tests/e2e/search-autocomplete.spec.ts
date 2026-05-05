import { expect, test } from "@playwright/test";

test.describe("search autocomplete", () => {
  test("typing shows suggestions and navigating to one works", async ({ page }) => {
    await page.goto("/");

    const input = page.getByRole("combobox");
    await expect(input).toBeVisible();

    await input.fill("Batman");

    // Suggestions popover appears
    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible({ timeout: 10_000 });

    // At least one suggestion
    const options = listbox.getByRole("option");
    await expect(options.first()).toBeVisible();

    // Click the first suggestion
    await options.first().click();

    // Navigated to a title page
    await expect(page).toHaveURL(/\/title\/(movie|tv)\/\d+/, { timeout: 10_000 });
  });

  test("Escape closes suggestions", async ({ page }) => {
    await page.goto("/");

    const input = page.getByRole("combobox");
    await input.fill("Avatar");

    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible({ timeout: 10_000 });

    await input.press("Escape");
    await expect(listbox).not.toBeVisible();
  });
});
