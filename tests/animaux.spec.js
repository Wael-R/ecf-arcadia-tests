const { test, expect } = require("@playwright/test");
const {
  goToMain,
  createAnimalForTest,
  cleanupAnimalForTest,
} = require("../common");

test("can see animal list", async ({ page }) => {
  await createAnimalForTest(page);
  await goToMain(page);
  await page
    .locator("#navbarContent")
    .getByRole("link", { name: "Animaux" })
    .click();

  await expect(page.getByRole("heading", { name: "Animaux" })).toBeVisible();
  await expect(page.locator("#searchInput")).toBeAttached();

  await page.locator("#searchInput").fill("TestAnimal");
  await page.locator("#searchInput").press("Enter");

  await expect(page.getByRole("heading", { name: "TestAnimal" })).toBeVisible();
  await expect(page.getByText("Bonne santé")).toBeVisible();

  await cleanupAnimalForTest(page);
});
