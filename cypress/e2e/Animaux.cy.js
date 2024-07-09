describe("Animaux Page Tests", () => {
  beforeEach(() => {
    cy.get("a.nav-link").contains("Animaux").click();
  });

  it("should have the correct title", () => {
    cy.title().should("eq", "Animaux - Zoo Arcadia");
  });

  it("should have a functioning navbar", () => {
    cy.get(".navbar-brand")
      .should("have.attr", "href", "/index.php")
      .and("contain", "Arcadia");
    cy.get(".navbar-nav a").should("have.length", 6);
    cy.get(".navbar-nav a")
      .eq(0)
      .should("have.attr", "href", "/index.php")
      .and("contain", "Accueil");
    cy.get(".navbar-nav a")
      .eq(1)
      .should("have.attr", "href", "/services.php")
      .and("contain", "Services");
    cy.get(".navbar-nav a")
      .eq(2)
      .should("have.attr", "href", "/habitats.php")
      .and("contain", "Habitats");
    cy.get(".navbar-nav a")
      .eq(3)
      .should("have.attr", "href", "/animals.php")
      .and("contain", "Animaux");
    cy.get(".navbar-nav a")
      .eq(4)
      .should("have.attr", "href", "/contact.php")
      .and("contain", "Contact");
    cy.get(".navbar-nav a")
      .eq(5)
      .should("have.attr", "href", "/login.php")
      .and("contain", "Connexion");
  });

  it("should have a functioning search bar", () => {
    const searchString = "Lion";
    cy.get("#searchInput")
      .type(searchString)
      .should("have.value", searchString);
  });

  it("should display animal cards with correct information", () => {
    cy.get(".card").should("have.length.at.least", 1);
    cy.get(".card").each(($card) => {
      cy.wrap($card)
        .find("img")
        .should("have.attr", "alt")
        .and("contain", "Image de");
      cy.wrap($card).find(".card-title").should("contain", "Nouvel animal");
      cy.wrap($card).find(".card-subtitle").should("contain", "Bonne santé");
      cy.wrap($card)
        .find(".btn-success")
        .should("contain", "Voir")
        .and("have.attr", "href")
        .and("match", /\/view_animal.php\?id=\d+/);
    });
  });
});
