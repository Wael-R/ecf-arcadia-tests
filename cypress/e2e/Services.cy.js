describe('Services Page - Zoo Arcadia', () => {
    beforeEach(() => {
        cy.get('a.nav-link').contains('Services').click()
    })
  
    it('should display the correct service card titles and descriptions', () => {
      const services = [
        {
          title: 'Restauration',
          description: 'Dégustez les plats du coin en admirant le paysage!'
        },
        {
          title: 'Visite des habitats avec un guide',
          description: 'Visitez les habitats du zoo avec un guide, gratuitement!'
        },
        {
          title: 'Visite du zoo en petit train',
          description: 'Faites un tour du zoo en petit train!'
        }
      ]
  
      services.forEach((service, index) => {
        cy.get('.card.card-body').eq(index).within(() => {
          cy.get('.card-title').should('have.text', service.title)
          cy.get('.card-text').should('have.text', service.description)
        })
      })
    })
  })
  