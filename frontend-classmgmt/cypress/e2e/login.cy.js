describe("Login Form", () => {
    it("logs in with email and password", () => {
      // Step 1: Visit login page
      cy.visit("http://localhost:5173/login");
  
      // Step 2: Fill the form
      cy.get('input[type="email"]').type("may11@may11.com");
      cy.get('input[type="password"]').type("may11may11");
  
      // Step 3: Submit the form
    //   cy.contains("Login").click();
        cy.get('form button[type="submit"]').click();
  
      // Step 4: Wait for redirect and confirm URL
      cy.url().should("eq", "http://localhost:5173/");
  
      // Step 5: Check for homepage welcome text
      cy.contains("Welcome to the Homepage").should("be.visible");
    });
  });
  