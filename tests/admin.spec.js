const { test, expect } = require("@playwright/test");
const { goToConnectionPage } = require("../common");
const { adminLogin, password } = require("../testData.json");

const connectAsAdmin = async (page) => {
  await goToConnectionPage(page);

  await page.getByLabel("Adresse Email").fill(adminLogin);
  await page.getByLabel("Mot de passe").fill(password);

  await page.getByRole("button", { name: "Connexion" }).click();

  await page.waitForURL("**/admin/index.php");
};

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

  await page.getByText("Service supprimé avec succès").click();
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

  await page.getByText("Habitat supprimé avec succès").click();
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

  await page
    .getByRole("heading", { name: "Modifier les animaux" })
    .scrollIntoViewIfNeeded();

  await page.getByLabel("Nom de l'animal").fill("Lionnelle");
  await page.getByLabel("Race de l'animal").fill("Lion");

  await page.getByRole("button", { name: "Créer un nouvel animal" }).click();

  await expect(page.getByText("Animal crée avec succès")).toBeVisible();

  // Delete animal
  await page
    .getByLabel("Animaux à modifier ou créer")
    .selectOption("(Auccun habitat)Lionnelle");
  await page.getByRole("button", { name: "Supprimer l'animal" }).click();

  await expect(
    page.getByText("Etes vous sûr de vouloir supprimer cet animal?")
  ).toBeVisible();
  await page.getByRole("button", { name: "Supprimer", exact: true }).click();

  await page.getByText("Animal supprimé avec succès").click();
});

test.skip("rest", async ({ page }) => {
  await page
    .getByRole("heading", { name: "Commentaires du vétérinaire" })
    .click();
  await page.getByText("Habitat", { exact: true }).click();
  await page.getByLabel("Habitat", { exact: true }).selectOption("1");
  await page.getByText("Habitat selectionné uniquement").click();
  await page
    .getByText(
      "Pour Savane, soumis le 6 juillet 2024 à 01:09Avis:Commentaire..."
    )
    .click();
  await page.getByText("Pour Savane, soumis le 6").click();
  await page.getByText("Avis:Commentaire...").click();
  await page.getByRole("heading", { name: "Modifier les animaux" }).click();
  await page.getByText("Animaux à modifier ou créer").click();
  await page.getByLabel("Nom de l'animal").click();
  await page.getByLabel("Nom de l'animal").fill("Lion");
  await page.getByLabel("Race de l'animal").click();
  await page
    .locator("#animalForm div")
    .filter({ hasText: "Nom de l'animal" })
    .click();
  await page.getByLabel("Nom de l'animal").click();
  await page.getByLabel("Nom de l'animal").fill("Lionnel");
  await page.getByLabel("Race de l'animal").click();
  await page.getByLabel("Race de l'animal").fill("Lion");
  await page.getByText("Race de l'animal").click();
  await page.getByText("Image(s) de l'animal").click();
  await page
    .getByText("Veuillez selectionner un animal pour modifier ses images")
    .click();
  await page
    .locator("#animalForm div")
    .filter({ hasText: "Affecter à un habitat" })
    .click();
  await page
    .locator("#animalForm div")
    .filter({ hasText: "Supprimer l'animal" })
    .click();
  await page.getByRole("button", { name: "Créer un nouvel animal" }).click();
  await page.getByText("Animal crée avec succès").click();
  await page.getByLabel("Animaux à modifier ou créer").selectOption("22");
  await page.getByRole("button", { name: "Affecter à un habitat" }).click();
  await page.getByRole("heading", { name: "Affecter à un habitat" }).click();
  await page.getByText("Choisissez un habitat au quel").click();
  await page.getByText("Choisissez un habitat au quel").click();
  await page.getByText("Annuler Affecter").click();
  await page.getByRole("button", { name: "Affecter", exact: true }).click();
  await page.getByText("Animal affecté a l'habitat").click();
  await page
    .getByRole("heading", { name: "Avis passés du vétérinaire" })
    .click();
  await page.getByText("Animal", { exact: true }).click();
  await page.getByLabel("Animal", { exact: true }).selectOption("1");
  await page.getByText("Aucun résultats").click();
  await page.getByText("Animal selectionné uniquement").click();
  await page.getByText("Date de début :").click();
  await page.getByRole("button", { name: "1 juillet 2024 à 15:" }).click();
  await page.getByText("Date de fin :").click();
  await page.getByRole("button", { name: "8 juillet 2024 à 15:" }).click();
  await page.getByRole("heading", { name: "Animaux populaires" }).click();
});
