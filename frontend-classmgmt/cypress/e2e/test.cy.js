it('check env', () => {
    console.log(Cypress.env()); // Will show all loaded env vars
    cy.log(`🔑 API Key: ${Cypress.env('FIREBASE_API_KEY')}`);
  });
  