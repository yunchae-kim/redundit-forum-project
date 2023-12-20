describe('render the chat messages', () => {
  it('able to send message', async () => {
    // log-in
    cy.visit('/login');
    cy.get('[for="userEmail"] > .LI-input').clear();
    cy.get('[for="userEmail"] > .LI-input').type('cypress_test_log_in');
    cy.get('[for="userPassword"] > .LI-input').clear();
    cy.get('[for="userPassword"] > .LI-input').type('cypress');
    cy.get('.LI-form > .bp3-button > .bp3-button-text').click();
    // after log-in should redirect to homepage
    cy.url().should('match', /5000\/$/);
    // send message
    cy.get('.navbar-icon-message').click();
    // should have UI to create chat
    cy.get('#NP-titleInputGroup').should('exist');
    cy.get('#NP-titleInputGroup').clear();
    cy.get('#NP-titleInputGroup').type('test');
    cy.get('#NP-postBtn').should('exist');
    cy.get('#NP-postBtn > .bp3-button-text').click();
    // chat window should appear after creating chat
    cy.get('.CP-chatwindow').should('exist');
    // compose and send message
    cy.get('.CW-input').clear();
    cy.get('.CW-input').type('test_message');
    cy.get('.CW-send').click();
    // message should show up in the chatwindow after send
    cy.get('.CW-chatentry').should('exist');
    cy.get('.CW-chatentry').should('contain', 'test_message');
  });
});
