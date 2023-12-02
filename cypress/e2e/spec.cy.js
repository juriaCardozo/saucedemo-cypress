function fazerLogin() {
  beforeEach(() => {
    cy.visit('www.saucedemo.com')
    cy.get('[data-test="username"]').type('standard_user')
    cy.get('[data-test="password"]').type('secret_sauce')
    cy.get('[data-test="login-button"]').click()
    cy.url().should('eq', 'https://www.saucedemo.com/inventory.html')
  })
}

describe('Cenário 1: Login e Navegação', () => {
  fazerLogin()

  it('Verificar se o usuário é redirecionado corretamente para a página inicial após o login.', () => {
    cy.url().should('eq', 'https://www.saucedemo.com/inventory.html')
  })

  it('Verificar se o menu de navegação está funcionando corretamente, permitindo a transição entre diferentes páginas.', () => {
    cy.get('#react-burger-menu-btn').click()
    cy.get('#about_sidebar_link').click()
  })

  it('Verificar se os elementos de navegação (links, botões etc.) estão corretamente posicionados e funcionais em todas as páginas.', () => {
    cy.get('.shopping_cart_link').click()
    cy.url().should('eq', 'https://www.saucedemo.com/cart.html')
    cy.get('[data-test="continue-shopping"]').click()
    cy.url().should('eq', 'https://www.saucedemo.com/inventory.html')

    cy.get('#item_4_title_link > .inventory_item_name').click()
    cy.url().should('eq', 'https://www.saucedemo.com/inventory-item.html?id=4')
    cy.get('[data-test="back-to-products"]').click()
    cy.url().should('eq', 'https://www.saucedemo.com/inventory.html')
  })
})

describe('Cenário 2: Catálogo de Produtos', () => {
  fazerLogin()

  it('Verificar se todos os produtos exibidos no catálogo estão corretamente listados.', () => {
    cy.get('.inventory_item').should('have.length.above', 5).each((item) => {
      cy.wrap(item).find('.inventory_item_name').should('be.visible')
      cy.wrap(item).find('.inventory_item_price').should('be.visible')
      cy.wrap(item).find('button').contains('Add to cart').should('be.visible')
    })
  })

  it('Verificar se as informações dos produtos (nome, preço, imagem etc.) estão corretas e correspondem aos produtos exibidos na interface.', () => {
    cy.get('.inventory_item').should('have.length.above', 5).each(($product) => {
      const productName = $product.find('.inventory_item_name').text().trim();
      const productPrice = $product.find('.inventory_item_price').text().trim();
      const productImageSrc = $product.find('img.inventory_item_img').attr('src');

      cy.wrap($product).find('.inventory_item_name').should('be.visible')
      cy.wrap($product).find('.inventory_item_price').should('be.visible')
      cy.wrap($product).find('.inventory_item_img').should('be.visible')

      cy.wrap(productName).should('not.be.empty');
      cy.wrap(productPrice).should('not.be.empty');
      cy.wrap(productImageSrc).should('include', '/static/media/');
    })
  })

  it('Testar a funcionalidade de busca de produtos, verificando se os resultados são consistentes e corretos.', () => {
    cy.get('[data-test="product_sort_container"]').select('Name (Z to A)');

    cy.get('.inventory_item').should('have.length.above', 5).each(($product, index, list) => {
      if (index === 0) return;

      const produtoAtual = $product.find('.inventory_item_name').text();
      const produtoAnterior = Cypress.$(list[index - 1]).find('.inventory_item_name').text();

      const comparacaoResultado = produtoAtual.localeCompare(produtoAnterior, 'en', { numeric: true });

      expect(comparacaoResultado).to.be.lessThan(0);
    });
  });
})

describe('Cenário 3: Adição de Produtos ao Carrinho', () => {
  fazerLogin()

  it('Testar a funcionalidade de adicionar produtos ao carrinho.', () => {
    cy.get('.inventory_item').should('have.length.above', 5).each((item, index) => {
      cy.wrap(item).find('button').contains('Add to cart').click()
      cy.get('.shopping_cart_badge').invoke('text').should('eq', (index+1).toString())
    })
  })

  it('Verificar se os produtos são corretamente adicionados e refletidos no resumo do carrinho.', () => {
    cy.get('.inventory_item').then(($product) => {
      for (let i=0; i<$product.length; i++) {
        let itemName
        cy.get(`:nth-child(${i + 1}) > .inventory_item_description .inventory_item_name`).invoke('text').then((text) => {
          itemName = text;
        });

        cy.get(`:nth-child(${i+1}) > .inventory_item_description button`).click()
        
        cy.get('.shopping_cart_link').click()
        cy.url().should('eq', 'https://www.saucedemo.com/cart.html')
        
        cy.get(`.cart_list > :nth-child(${i + 3}) .inventory_item_name`).invoke('text').then((text) => {
          cy.wrap(text).should('eq', itemName)
        })
        cy.go('back')
      }
    })    
  })

  it('Testar o limite máximo de produtos que podem ser adicionados ao carrinho e verificar se o sistema está tratando corretamente essa condição.', () => {
    
  })
})

describe('Cenário 4: Finalização da Compra', () => {
  it('Verificar se o fluxo de finalização da compra está funcionando corretamente.', () => {
    
  })
  
  it('Testar diferentes métodos de pagamento (cartão de crédito, PayPal, etc.) e verificar se os dados são corretamente processados.', () => {

  })

  it('Verificar se os produtos selecionados são exibidos corretamente no resumo da compra e no recibo final.', () => {

  })
})

describe('Cenário 5: Conta de Usuário', () => {
  it('Testar a funcionalidade de criação de uma nova conta de usuário.', () => {
    
  })
  
  it('Verificar se os dados fornecidos são corretamente armazenados no sistema.', () => {

  })

  it('Testar a funcionalidade de edição de informações da conta e verificar se as alterações são salvas corretamente.', () => {

  })
})