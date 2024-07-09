describe("Zoo Arcadia Page", () => {
  it("should display the navbar", () => {
    const links = [
      { text: "Accueil", href: "/index.php" },
      { text: "Services", href: "/services.php" },
      { text: "Habitats", href: "/habitats.php" },
      { text: "Animaux", href: "/animals.php" },
      { text: "Contact", href: "/contact.php" },
      { text: "Connexion", href: "/login.php" },
    ];

    links.forEach((link) => {
      cy.contains("a.nav-link", link.text).should(
        "have.attr",
        "href",
        link.href
      );
    });
  });

  it("should cycle through the carousel images", () => {
    cy.get(".carousel-item").should("have.length", 3);
    cy.get(".carousel-control-next").click();
    cy.get(".carousel-item.active").should("have.length", 1);
    cy.get(".carousel-control-next").click();
    cy.get(".carousel-item.active").should("have.length", 1);
    cy.get(".carousel-control-prev").click();
    cy.get(".carousel-item.active").should("have.length", 1);
  });

  it("should show and hide the review form", () => {
    cy.get("#reviewAddButton").click();
    cy.get("#reviewFormDiv").should("not.have.class", "d-none");
    cy.get("#reviewCancelButton").click();
    cy.get("#reviewFormDiv").should("have.class", "d-none");
  });

  it("should submit a review", () => {
    cy.intercept("POST", "reviewSubmit.php").as("submitReview");

    cy.get("#reviewAddButton").click();
    cy.get("#reviewUsername").type("Test User");
    cy.get("#reviewContent").type("This is a test review.");
    cy.get("#reviewSubmitButton").click();

    cy.wait("@submitReview").its("response.statusCode").should("eq", 200);
    cy.get("#reviewMessage").should("contain", "Avis soumis avec succès");
  });
});
