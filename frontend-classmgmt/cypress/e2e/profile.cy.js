describe('Profile Integration Test', () => {
    it('should show valid email if user is returned, otherwise fail cleanly', () => {
      cy.visit('http://localhost:5173/profile');
  
      // Wait for either a valid user OR an error message
      cy.get('body').then(($body) => {
        const bodyText = $body.text();
  
        if (bodyText.includes('User not found')) {
          throw new Error('❌ Backend failed or user not returned.');
        }
  
        // Look for the Email: label (if it’s present, the backend worked)
        if (bodyText.includes('Email:')) {
          cy.contains('Email:')
            .parent()
            .invoke('text')
            .then((text) => {
              const emailMatch = text.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
              expect(emailMatch).to.not.be.null;
            });
        } else {
          throw new Error('❌ Expected "Email:" but did not find it.');
        }
      });
    });
  });
  