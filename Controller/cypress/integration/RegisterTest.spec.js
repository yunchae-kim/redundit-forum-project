// require('dotenv').config();
// const knex = require('knex')({
//   client: 'mysql2',
//   connection: {
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER_ADMIN,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE,
//   },
// });

describe('render the sign-up page', () => {
  // after(async () => {
  //   await knex('user').where('username', 'cypress_test').del();
  // });

  it('renders correctly', () => {
    cy.visit('/signup');
    cy.get('.bp3-navbar').should('exist');
    cy.get('.navbar-icon-message').should('not.exist');
    cy.get('.SU-container').should('exist');
    cy.url().should('match', /signup$/);
  });

  it('able to register correctly', async () => {
    cy.visit('/signup');
    cy.get('[for="userEmail"] > .SU-input').click();
    cy.get('[for="userEmail"] > .SU-input').clear();
    cy.get('[for="userEmail"] > .SU-input').type('cypress_test');
    cy.get(':nth-child(3) > .SU-input').click();
    cy.get(':nth-child(3) > .SU-input').clear();
    cy.get(':nth-child(3) > .SU-input').type('cypress');
    cy.get(':nth-child(4) > .SU-input').click();
    cy.get(':nth-child(4) > .SU-input').clear();
    cy.get(':nth-child(4) > .SU-input').type('cypress');
    cy.get('.SU-form > .bp3-button > .bp3-button-text').click();
    cy.url().should('match', /login$/);
    cy.get('.LI-container').should('exist');
  });
});
