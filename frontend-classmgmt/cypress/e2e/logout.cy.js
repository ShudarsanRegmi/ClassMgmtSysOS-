describe('Logout Functionality', () => {
    it('should redirect to /login when visiting /logut', () => {
      // Visit the logout route (intentional misspelling of 'logout' assumed from your URL)
      cy.visit('http://localhost:5173/logout');
  
      // Assert that the URL is redirected to /login
      cy.url().should('include', '/login');
  
      // Optionally check that login form is visible
      cy.contains('Login').should('be.visible'); // Update text check based on your UI
    });
  });
  