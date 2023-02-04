
describe('home page', () => {
    it('sample test', () => {
        cy.visit('www.google.com')
    })

    it('server test', () => {
        cy.visit('http://localhost:8080/')
    })
})
