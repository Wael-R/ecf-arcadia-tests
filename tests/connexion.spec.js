const { test, expect } = require("@playwright/test");
const { goToMain } = require("../common");
const { adminLogin, password } = require("../testData.json");

test("should show an error message on invalid login attempt", async ({
  page,
}) => {
  await goToMain(page);
  await page.getByRole("link", { name: "Connexion" }).click();

  await page.getByLabel("Adresse Email").fill("invalid@example.com");
  await page.getByLabel("Mot de passe").fill("wrongpassword");

  await page.getByRole("button", { name: "Connexion" }).click();
  await page.getByText("Erreur: E-mail incorrecte").click();
});

test("should display admin page on valid login attempt", async ({ page }) => {
  await goToMain(page);
  await page.getByRole("link", { name: "Connexion" }).click();

  await page.getByLabel("Adresse Email").fill(adminLogin);
  await page.getByLabel("Mot de passe").fill(password);

  await page.getByRole("button", { name: "Connexion" }).click();

  await page.waitForURL("**/admin/index.php");

  await expect(
    page.getByRole("heading", { name: "Espace Administrateur" })
  ).toBeVisible();
});