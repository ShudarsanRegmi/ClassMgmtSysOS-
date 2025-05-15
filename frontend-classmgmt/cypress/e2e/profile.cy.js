describe('Profile Page', () => {
    beforeEach(() => {
      // Assumes user is already logged in
      cy.visit('http://localhost:5173/profile');
    });
  
    it('should show a valid email if the user exists', () => {
      // Wait for the loading message to disappear
      cy.contains('Loading...').should('not.exist');
  
      // Now check the body for either the profile or the error message
      cy.get('body').then(($body) => {
        if ($body.text().includes('User not found')) {
          throw new Error('User not found – profile did not load successfully');
        } else {
          // Find the email line and extract the actual email text
          cy.contains('Email:')
            .parent() // Ensure we are targeting the parent element containing the email text
            .invoke('text')
            .then((text) => {
              const email = text.match(/Email:\s*(.*)/)?.[1]?.trim(); // Extract email using regex
              cy.log(`Extracted email: ${email}`);
              expect(email, 'Email should be valid').to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
            });
        }
      });
    });
  });
  