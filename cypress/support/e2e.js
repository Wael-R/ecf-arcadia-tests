Cypress.config("experimentalSessionSupport", true); // set this flag

beforeEach(() => {
  cy.visit("192.168.1.14:29000");
});
