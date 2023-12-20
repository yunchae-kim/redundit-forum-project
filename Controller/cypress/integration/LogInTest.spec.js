describe('render the log-in page', () => {
  it('renders correctly', () => {
    cy.visit('/login');
    cy.get('.bp3-navbar').should('exist');
    cy.get('.LI-container').should('exist');

    // message icon should not exist before log-in
    cy.get('.navbar-icon-message').should('not.exist');
    cy.url().should('match', /login$/);
  });

  it('able to log-in correctly', async () => {
    cy.visit('/login');
    cy.get('[for="userEmail"] > .LI-input').clear();
    cy.get('[for="userEmail"] > .LI-input').type('cypress_test_log_in');
    cy.get('[for="userPassword"] > .LI-input').clear();
    cy.get('[for="userPassword"] > .LI-input').type('cypress');
    cy.get('.LI-form > .bp3-button > .bp3-button-text').click();
    // after log-in should redirect to homepage
    cy.url().should('match', /5000\/$/);
    // message icon should exist now
    cy.get('.navbar-icon-message').should('exist');
  });
});
