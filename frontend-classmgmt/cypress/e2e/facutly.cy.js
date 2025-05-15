describe('Create Faculty Form with Cleanup by ID', () => {
    const testFaculty = {
      name: 'Test Professor',
      email: `test.prof.${Date.now()}@college.edu`,
    };
    require('dotenv').config();
  
    const firebaseApiKey = Cypress.env('FIREBASE_API_KEY');


    const testUserCredentials = {
      email: 'may11@may11.com',
      password: 'may11may11',
      returnSecureToken: true,
    };
  
    let facultyId = null;
    let idToken = null;
  
    before(() => {
      // Login to Firebase manually via REST API
      cy.request({
        method: 'POST',
        url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`,
        body: testUserCredentials,
      }).then((res) => {
        expect(res.status).to.eq(200);
        idToken = res.body.idToken;
        expect(idToken).to.be.a('string');
        cy.log('🔐 Firebase login successful.');
      });
    });
  
    beforeEach(() => {
      cy.visit('http://localhost:5173/faculties/register');
    });
  
    it('creates a faculty and confirms success message', () => {
      cy.intercept('POST', 'http://localhost:3001/api/admin/faculty/register').as('registerFaculty');
  
      cy.get('input[name="name"]').type(testFaculty.name);
      cy.get('input[name="email"]').type(testFaculty.email);
      cy.get('[data-testid="submit-button"]').click();
  
      cy.wait('@registerFaculty').then(({ response }) => {
        expect(response.statusCode).to.eq(201);
        expect(response.body.message).to.eq('Faculty created successfully');
        facultyId = response.body.data._id;
        expect(facultyId).to.be.a('string');
      });
  
      cy.contains('✅ Faculty added successfully!', { timeout: 5000 }).should('exist');
    });
  
    after(() => {
      if (!facultyId || !idToken) {
        cy.log('⚠️ Missing faculty ID or token. Skipping deletion.');
        return;
      }
  
      cy.request({
        method: 'DELETE',
        url: `http://localhost:3001/api/admin/faculty/deleteFaculty/${facultyId}`,
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.be.oneOf([200, 204]);
        expect(res.body.message).to.eq('Faculty deleted successfully.');
        cy.log(`🧼 Cleaned up faculty with ID: ${facultyId}`);
      });
    });
  });
  