const { expect } = require("@playwright/test");
const { adminLogin, password } = require("./testData.json");

export const goToMain = async (page) => {
  await page.goto("http://192.168.1.14:29000/");
};

export const goToConnectionPage = async (page) => {
  await goToMain(page);
  await page.getByRole("link", { name: "Connexion" }).click();
};

export const connectAsAdmin = async (page) => {
  await goToConnectionPage(page);

  await page.getByLabel("Adresse Email").fill(adminLogin);
  await page.getByLabel("Mot de passe").fill(password);

  await page.getByRole("button", { name: "Connexion" }).click();

  await page.waitForURL("**/admin/index.php");
};

export const createAnimalForTest = async (page) => {
  await connectAsAdmin(page);

  await page
    .getByRole("heading", { name: "Modifier les animaux" })
    .scrollIntoViewIfNeeded();

  await page.getByLabel("Nom de l'animal").fill("TestAnimal");
  await page.getByLabel("Race de l'animal").fill("TestAnimal");

  await page.getByRole("button", { name: "Créer un nouvel animal" }).click();

  await expect(page.getByText("Animal crée avec succès")).toBeVisible();
};

export const cleanupAnimalForTest = async (page) => {
  await connectAsAdmin(page);

  await page
    .getByRole("heading", { name: "Modifier les animaux" })
    .scrollIntoViewIfNeeded();

  await page
    .getByLabel("Animaux à modifier ou créer")
    .selectOption("(Savane) TestAnimal");
  await page.getByRole("button", { name: "Supprimer l'animal" }).click();
  await page.getByRole("button", { name: "Supprimer", exact: true }).click();

  await expect(page.getByText("Animal supprimé avec succès")).toBeVisible();
};
