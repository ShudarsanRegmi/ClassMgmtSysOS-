describe('AddClass Form', () => {
    const validClass = {
      name: 'Test Class',
      classId: 'class101',
      year: 2023,
      department: 'cys',
      section: 'A'
    };
  
    beforeEach(() => {
      cy.visit('http://localhost:5173/class/add'); // Adjust if your route is different
    });
  
    it('should successfully submit the form and show success alert', () => {
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alert'); // Spy on window.alert
      });
  
      cy.intercept('POST', '**/api/class/create', {
        statusCode: 201,
        body: { message: 'Class created successfully!' }
      }).as('createClass');
  
      cy.get('input[name="name"]').type(validClass.name);
      cy.get('input[name="classId"]').type(validClass.classId + Math.floor(Math.random() * 1000));
      cy.get('input[name="year"]').type(validClass.year.toString());
      cy.get('input[name="department"]').type(validClass.department);
      cy.get('input[name="section"]').type(validClass.section);
      
      cy.get('form').submit();
  
      cy.wait('@createClass');
  
      cy.get('@alert').should('have.been.calledWith', 'Class created successfully!');
    });
  
    it('should display an error message when class creation fails', () => {
      cy.intercept('POST', '**/api/class/create', {
        statusCode: 500,
        body: { message: 'Internal Server Error' }
      }).as('createClassFail');
  
      cy.get('input[name="name"]').type(validClass.name);
      cy.get('input[name="classId"]').type(validClass.classId + Math.floor(Math.random() * 1000));
      cy.get('input[name="year"]').type(validClass.year.toString());
      cy.get('input[name="department"]').type(validClass.department);
      cy.get('input[name="section"]').type(validClass.section);
  
      cy.get('form').submit();
  
      cy.wait('@createClassFail');
  
      cy.contains('Failed to create class. Please try again.').should('be.visible');
    });
  });
  