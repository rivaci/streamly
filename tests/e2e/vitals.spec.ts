import { expect, test } from "@playwright/test";

test.describe("web vitals reporter", () => {
  test("sends at least one metric to /api/vitals", async ({ page }) => {
    const vitalsRequests: unknown[] = [];

    await page.route("**/api/vitals", async (route) => {
      const body = route.request().postDataJSON();
      vitalsRequests.push(body);
      await route.fulfill({ status: 204 });
    });

    await page.goto("/");
    // Give the browser a moment to report vitals
    await page.waitForTimeout(3000);

    expect(vitalsRequests.length).toBeGreaterThan(0);
  });
});
