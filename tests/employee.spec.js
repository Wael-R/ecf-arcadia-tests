const { test, expect } = require("@playwright/test");
const {
  goToConnectionPage,
  createAnimalForTest,
  cleanupAnimalForTest,
} = require("../common");
const { employeeLogin, password } = require("../testData.json");

const connectAsEmployee = async (page) => {
  await goToConnectionPage(page);

  await page.getByLabel("Adresse Email").fill(employeeLogin);
  await page.getByLabel("Mot de passe").fill(password);

  await page.getByRole("button", { name: "Connexion" }).click();

  await page.waitForURL("**/admin/index.php");

  await expect(
    page.getByRole("heading", { name: "Espace Employé" })
  ).toBeVisible();
};

test("can see services editing", async ({ page }) => {
  await connectAsEmployee(page);
  await expect(page.getByText("Modifier les services")).toBeAttached();
  // Creation/deletion of service tested in admin.spec
});

test("can add and view animal consumption", async ({ page }) => {
  await createAnimalForTest(page);
  await connectAsEmployee(page);

  await page
    .getByRole("heading", { name: "Consommation des animaux", exact: true })
    .scrollIntoViewIfNeeded();
  await expect(page.locator("#animalSelect")).toBeAttached();
  await expect(page.getByLabel("Nourriture", { exact: true })).toBeAttached();
  await expect(
    page.getByLabel("Quantité de nourriture", { exact: true })
  ).toBeAttached();
  await expect(
    page.getByLabel("Date de passage", { exact: true })
  ).toBeAttached();

  await page.locator("#animalSelect").selectOption("TestAnimal");
  await page.getByLabel("Nourriture", { exact: true }).fill("viande");
  await page.getByLabel("Quantité de nourriture").fill("2kg");

  await page.getByRole("button", { name: "Ajouter" }).click();
  await expect(
    page.getByText("Avis soumis avec succès", { exact: true })
  ).toBeAttached();

  await cleanupAnimalForTest(page);
});

test("can view animal consumption", async ({ page }) => {
  await connectAsEmployee(page);

  await page
    .getByRole("heading", {
      name: "Historique de consommation des animaux",
      exact: true,
    })
    .scrollIntoViewIfNeeded();

  await expect(page.locator("#animalFoodFilterSelect")).toBeAttached();
  await expect(
    page.getByRole("checkbox", {
      name: "Animal selectionné uniquement",
      exact: true,
    })
  ).toBeAttached();
  await expect(page.getByText("Date de début :")).toBeAttached();
  await expect(page.getByText("Date de fin :")).toBeAttached();
});

test("can view reviews to be validated", async ({ page }) => {
  await connectAsEmployee(page);

  await page
    .getByRole("heading", { name: "Valider les avis" })
    .scrollIntoViewIfNeeded();

  await expect(page.getByText("Aucun avis à valider")).toBeAttached();
});
