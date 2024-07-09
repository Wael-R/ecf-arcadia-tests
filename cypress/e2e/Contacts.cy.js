describe("Contact Page Tests", () => {
  beforeEach(() => {
    cy.get("a.nav-link").contains("Contact").click();
  });

  it("should have the correct title", () => {
    cy.title().should("eq", "Contact - Zoo Arcadia");
  });

  it("should display and validate the contact form", () => {
    cy.get("#contactForm").should("exist");

    cy.get("#contactEmail")
      .should("exist")
      .should("have.attr", "type", "email")
      .and("have.attr", "required");

    cy.get("#contactTitle")
      .should("exist")
      .should("have.attr", "type", "text")
      .and("have.attr", "required");

    cy.get("#contactContent")
      .should("exist")
      .should("have.attr", "rows", "6")
      .and("have.attr", "required");

    cy.get("#contactSubmit").should("exist").should("contain", "Envoyer");

    cy.get("#contactForm").within(() => {
      // Fill the form with valid data
      cy.get("#contactEmail").type("test@example.com");
      cy.get("#contactTitle").type("Test Subject");
      cy.get("#contactContent").type("This is a test message.");

      // Submit the form
      cy.get("#contactSubmit").click();
    });

    cy.get("#contactMessage").should(
      "contain",
      "Erreur: Aucun serveur mail disponible"
    );
  });
});
