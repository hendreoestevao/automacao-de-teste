
// cy.viewport
// arquivos de config
// configs por linha de comando

import { format, prepareLocalStorage } from '../../support/utils'

context('Dev Finance', () =>{

  // hooks
  //trechos que executam antes e depois do teste
  //beforce -> antes de todos os teste
  //beforeEach -> antes de cada teste
  //after -> depois de todos os testes
  //afterEach-> depois de cada teste

  beforeEach(() => {
    cy.visit('https://dev-finance.netlify.app/', {
      onBeforeLoad: (win) =>{
        prepareLocalStorage(win)
      }
    })


  });

  it('Cadastrar entradas', () =>{
    
      cy.get('#transaction .button').click() // id + classe

      cy.get('#description').type('Mesada') // id
      cy.get('[name=amount]').type(12) //atributos
      cy.get('[type=date]').type('2021-03-12') //atributos
      cy.get('button').contains('Salvar').click() //tipo e valor

      cy.get('#data-table tbody tr').should('have.length', 1)
      //os dados que foram cadastrados
  });
  //cadastrar saidas
  it('Cadastrar saidas', () => {
    
    cy.get('#transaction .button').click() // id + classe

    cy.get('#description').type('Mesada') // id
    cy.get('[name=amount]').type(-12) //atributos
    cy.get('[type=date]').type('2021-03-12') //atributos
    cy.get('button').contains('Salvar').click() //tipo e valor

    cy.get('#data-table tbody tr').should('have.length', 1)
  })

  it('Remover entradas e saídas', () =>{

    const entrada = 'Mesada'
    const saida = 'KinderOvo'


    cy.get('#transaction .button').click() // id + classe

    cy.get('#description').type(entrada) // id
    cy.get('[name=amount]').type(100) //atributos
    cy.get('[type=date]').type('2021-03-12') //atributos
    cy.get('button').contains('Salvar').click() //tipo e valor

    cy.get('#transaction .button').click() // id + classe

    cy.get('#description').type(saida) // id
    cy.get('[name=amount]').type(-35) //atributos
    cy.get('[type=date]').type('2021-03-12') //atributos
    cy.get('button').contains('Salvar').click() //tipo e valor


    //estrategia 1 : voltar para o elemento pai, ee avançar para um td img atributo
    cy.get('td.description')
      .contains(entrada)
      .parent()
      .find('img[onclick*=remove]')
      .click()

      //estrategia:2 buscar todos os irmoes, e buscar o que tem img + attr

      cy.get('td.description')
        .contains(saida)
        .siblings()
        .children('img[onclick*=remove]')
        .click()

        
  });

  it('Validar saldo com diversas transações', () =>{
    const entrada = 'Mesada'
    const saida = 'KinderOvo'


    cy.get('#transaction .button').click() // id + classe

    cy.get('#description').type(entrada) // id
    cy.get('[name=amount]').type(100) //atributos
    cy.get('[type=date]').type('2021-03-12') //atributos
    cy.get('button').contains('Salvar').click() //tipo e valor

    cy.get('#transaction .button').click() // id + classe

    cy.get('#description').type(saida) // id
    cy.get('[name=amount]').type(-35) //atributos
    cy.get('[type=date]').type('2021-03-12') //atributos
    cy.get('button').contains('Salvar').click() //tipo e valor
      //capturar as linhas com as transações e as colunas com valores
      //capturar o texto dessas colunas
      // formatar esse valores das linhas

    //somar os valores de entradas e saidas

      //capturar o texto do total
      //comparar  o somatorio de entradas e despesas com o  total

    let incomes = 0
    let expenses = 0

      cy.get('#data-table tbody tr')
        .each(($el, index , $list) =>{
          cy.get($el).find('td.income, td.expense')
            .invoke('text').then(text => {
              if(text.includes('-')){
                expenses = expenses + format(text)
              }else {
                incomes = incomes + format(text)
              }

              cy.log(`entradas`,incomes)
              cy.log(`saidas` ,expenses)
            })

        })

        cy.get('#totalDisplay').invoke('text').then(text => {
          cy.log(`valor total` , format(text))
          let formattedTotalDisplay = format(text)
          let expectedTotal = incomes + expenses 

          expect(formattedTotalDisplay).to.eq(expectedTotal)
        })

    })
});