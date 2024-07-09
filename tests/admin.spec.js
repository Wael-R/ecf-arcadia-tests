const { test, expect } = require("@playwright/test");
const { connectAsAdmin } = require("../common");

test("can update opening hours", async ({ page }) => {
  await connectAsAdmin(page);

  await page.getByRole("link", { name: "Horaires" }).click();

  await expect(page.getByText("Horaires d'ouverture")).toBeVisible();

  await page.locator("#openingHours").selectOption("8");
  await page.locator("#closingHours").selectOption("20");
  await page.locator("#openingDays").selectOption("1");

  await page.getByRole("button", { name: "Modifier les horaires" }).click();

  await expect(page.getByText("Horaires d'ouverture")).toBeVisible();
});

test("can create employee accounts", async ({ page }) => {
  await connectAsAdmin(page);

  await page
    .getByRole("heading", { name: "Créer un compte" })
    .scrollIntoViewIfNeeded();

  const date = new Date().getTime();
  await page.getByLabel("Adresse Email").fill(`newUser-${date}@employee`);
  await page.getByLabel("Mot de passe").fill("newMDP");

  await page.getByRole("button", { name: "Créer un compte" }).click();

  await expect(page.getByText("Compte crée avec succès")).toBeVisible();
});

test("can create veterinarian accounts", async ({ page }) => {
  await connectAsAdmin(page);

  await page
    .getByRole("heading", { name: "Créer un compte" })
    .scrollIntoViewIfNeeded();

  const date = new Date().getTime();
  await page.getByLabel("Adresse Email").fill(`newUser-${date}@employee`);
  await page.getByLabel("Mot de passe").fill("newMDP");
  await page.getByText("Vétérinaire", { exact: true }).click();

  await page.getByRole("button", { name: "Créer un compte" }).click();

  await expect(page.getByText("Compte crée avec succès")).toBeVisible();
});

test("can create and delete services", async ({ page }) => {
  await connectAsAdmin(page);

  await page
    .getByRole("heading", { name: "Modifier les services" })
    .scrollIntoViewIfNeeded();

  await page.getByLabel("Nom du service").fill("Service test");
  await page.getByLabel("Description du service").fill("Description for test");

  await page.getByRole("button", { name: "Créer un nouveau service" }).click();

  await expect(page.getByText("Service crée avec succès")).toBeVisible();

  // Delete service
  await page
    .getByLabel("Service à modifier ou créer")
    .selectOption("Service test");
  await page.getByRole("button", { name: "Supprimer le service" }).click();

  await expect(
    page.getByText("Etes vous sûr de vouloir supprimer ce service?")
  ).toBeVisible();
  await page.getByRole("button", { name: "Supprimer", exact: true }).click();

  await expect(page.getByText("Service supprimé avec succès")).toBeVisible();
});

test("can add and delete habitat", async ({ page }) => {
  await connectAsAdmin(page);

  await page
    .getByRole("heading", { name: "Modifier les habitats" })
    .scrollIntoViewIfNeeded();

  await page.getByLabel("Nom de l'habitat").fill("Bayou");
  await page.getByLabel("Description du service").fill("Bayou Description");

  await page.getByRole("button", { name: "Créer un nouvel habitat" }).click();

  await expect(page.getByText("Habitat crée avec succès")).toBeVisible();

  // Delete habitat
  await page.getByLabel("Habitats à modifier ou créer").selectOption("Bayou");
  await page.getByRole("button", { name: "Supprimer l'habitat" }).click();

  await expect(
    page.getByText("Etes vous sûr de vouloir supprimer cet habitat?")
  ).toBeVisible();
  await page.getByRole("button", { name: "Supprimer", exact: true }).click();

  await expect(page.getByText("Habitat supprimé avec succès")).toBeVisible();
});

test("check vet comments regarding habitats", async ({ page }) => {
  await connectAsAdmin(page);

  await page
    .getByRole("heading", { name: "Commentaires du vétérinaire" })
    .scrollIntoViewIfNeeded();

  await expect(
    page.getByRole("combobox", { name: "Animal", exact: true })
  ).toBeVisible();

  await expect(
    page.getByRole("checkbox", {
      name: "Animal selectionné uniquement",
      exact: true,
    })
  ).toBeVisible();
});

test("check vet comments regarding animals", async ({ page }) => {
  await connectAsAdmin(page);

  await page
    .getByRole("heading", { name: "Avis passés du vétérinaire" })
    .scrollIntoViewIfNeeded();

  await expect(
    page.getByRole("combobox", { name: "Habitat", exact: true })
  ).toBeVisible();

  await expect(
    page.getByRole("checkbox", {
      name: "Habitat selectionné uniquement",
      exact: true,
    })
  ).toBeVisible();
});

test("can add and delete animal", async ({ page }) => {
  await connectAsAdmin(page);

  // Create animal
  await page
    .getByRole("heading", { name: "Modifier les animaux" })
    .scrollIntoViewIfNeeded();

  await page.getByLabel("Nom de l'animal").fill("Lion");
  await page.getByLabel("Race de l'animal").fill("Lion");

  await page.getByRole("button", { name: "Créer un nouvel animal" }).click();

  await expect(
    page
      .locator("#animalMessage")
      .filter({ hasText: "Animal crée avec succès" })
  ).toBeVisible();

  // Assign to habitat
  await page
    .getByLabel("Animaux à modifier ou créer")
    .selectOption("(Savane) Lion");
  await page.getByRole("button", { name: "Affecter à un habitat" }).click();
  await expect(
    page.locator(".modal").getByText("Affecter à un habitat")
  ).toBeVisible();
  await expect(
    page
      .locator(".modal")
      .getByText("Choisissez un habitat au quel affecter cet animal:")
  ).toBeVisible();

  await page.locator(".modal #animalHabitatSelect").selectOption("Jungle");

  await page
    .locator(".modal")
    .getByRole("button", { name: "Affecter", exact: true })
    .click();
  await expect(page.getByText("Animal affecté a l'habitat")).toBeVisible();

  // Delete animal
  await page
    .getByLabel("Animaux à modifier ou créer")
    .selectOption("(Jungle) Lion");
  await page.getByRole("button", { name: "Supprimer l'animal" }).click();

  await expect(
    page.getByText("Etes vous sûr de vouloir supprimer cet animal?")
  ).toBeVisible();
  await page.getByRole("button", { name: "Supprimer", exact: true }).click();

  await expect(
    page
      .locator("#animalMessage")
      .filter({ hasText: "Animal supprimé avec succès" })
  ).toBeVisible();
});

test("can check popular animals", async ({ page }) => {
  await connectAsAdmin(page);

  // popular animals
  await page
    .getByRole("heading", { name: "Animaux populaires" })
    .scrollIntoViewIfNeeded();
  await expect(page.locator("#animalStatsContainer")).toBeAttached();
});
