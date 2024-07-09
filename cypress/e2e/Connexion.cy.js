describe("Login Page Tests", { testIsolation: false }, () => {
  beforeEach(() => {
    cy.get("a.nav-link").contains("Connexion").click();
    cy.get("form").then((form$) => {
      form$.on("submit", (e) => {
        e.preventDefault();
      });
    });
  });

  it("should have the correct title", () => {
    cy.title().should("eq", "Connexion - Zoo Arcadia");
  });

  it("should display and validate the login form", () => {
    cy.get("#loginForm").should("exist");

    cy.get("#email").should("exist").should("have.attr", "type", "email");

    cy.get("#pass").should("exist").should("have.attr", "type", "password");

    cy.get('button[type="submit"]')
      .should("exist")
      .should("contain", "Connexion");
  });

  it.only("should show an error message on invalid login attempt", () => {
    cy.intercept("POST", "/admin/authLogin.php").as("loginRequest");
    cy.get("#loginForm").within(() => {
      // Fill in the form fields with invalid credentials
      cy.get("#email").type("invalid@example.com");
      cy.get("#pass").type("wrongpassword");

      // Submit the form
      cy.get("button").contains("Connexion").click();

      // Intercept the request to verify the response

      //   cy.request("admin/authLogin.php", {
      //     method: "POST",
      //     body: { email: "invalid@example.com", pass: "wrongpassword" },
      //   });

      // Wait for the request to complete and verify the error message
      cy.wait("@loginRequest");
      cy.get("#loginMessage").should("contain", "Erreur: Invalid credentials");
    });
  });

  it.only("should redirect to the admin dashboard on successful login", () => {
    cy.intercept("POST", "/admin/authLogin.php").as("loginRequest");

    cy.get("#loginForm").within(() => {
      // Fill in the form fields with valid credentials
      cy.get("#email").type("admin@arcadia");
      cy.get("#pass").type("123451");

      // Intercept the request to verify the response
      //   cy.intercept("POST", "/admin/authLogin.php").as("loginRequest");

      // Submit the form
      cy.get("button").contains("Connexion").click();

      // Wait for the request to complete and verify the redirection
      cy.wait("@loginRequest");
      cy.url().should("include", "/admin/index.php");
      cy.title().should("eq", "Admin - Zoo Arcadia");
    });
  });
});
