describe("Habitats Page - Zoo Arcadia", () => {
  beforeEach(() => {
    cy.get("a.nav-link").contains("Habitats").click();
  });

  it("should display the correct habitat card titles, descriptions, and images", () => {
    const habitats = [
      {
        title: "Jungle",
        description: "Une forêt tropicale dense, verte et luxuriante.",
        imgAlt: "Image de Jungle",
      },
      {
        title: "Marais",
        description: "Une zone humide envahie par la végétation aquatique.",
        imgAlt: "Image de Marais",
      },
      {
        title: "Savane",
        description: "Un environnement vaste, herbeux et chaud.",
        imgAlt: "Image de Savane",
      },
    ];

    habitats.forEach((habitat, index) => {
      cy.get(".card")
        .eq(index)
        .within(() => {
          cy.get(".card-title").should("have.text", habitat.title);
          cy.get(".card-text").should("have.text", habitat.description);
          cy.get("img.list-img").should("have.attr", "alt", habitat.imgAlt);
        });
    });
  });

  it("should have a functioning search input", () => {
    // todo: add id to input
    cy.get("#searchInput").type("Jungle{enter}");
    cy.url().should("include", "?q=Jungle");
  });

  it("should navigate to the correct habitat detail page when the Voir button is clicked", () => {
    cy.get("#searchInput").type("Jungle{enter}");
    cy.contains("Voir").click();

    //display the correct habitat title and description
    cy.get("h2").should("have.text", "Jungle");
    cy.get(".main-row").contains(
      "Une forêt tropicale dense, verte et luxuriante."
    );

    cy.get(".carousel-item").each(() => {
      cy.get("img").should("have.attr", "alt", "Image de Jungle");
    });

    //navigate through the carousel images using controls
    cy.get(".carousel-item").first().should("have.class", "active");
    cy.get(".carousel-control-next").click();
    cy.get(".carousel-item").first().should("not.have.class", "active");
    cy.get(".carousel-item").last().should("have.class", "active");
    cy.get(".carousel-control-prev").click();
    cy.get(".carousel-item").first().should("have.class", "active");

    //should display correct animal card details
    const animals = [
      {
        title: "Nouvel animal 1",
        alt: "Image de Nouvel animal 1",
        health: "Bonne santé",
      },
      {
        title: "Nouvel animal 2",
        alt: "Image de Nouvel animal 2",
        health: "Bonne santé",
      },
    ];

    animals.forEach((animal, index) => {
      cy.get(".large-scroll .card.mb-3")
        .eq(index)
        .within(() => {
          cy.get(".card-title").should("have.text", animal.title);
          cy.get("img").should("have.attr", "alt", animal.alt);
          cy.contains("p", animal.health);
        });
    });
  });

  it("should navigate from habitat detail page to animal detail page", () => {
    cy.get("#searchInput").type("Jungle{enter}");
    cy.contains("Voir").click();

    //navigate to first animal page
    cy.contains("Voir").first().click();
    cy.url().should("include", "view_animal");
  });
});
