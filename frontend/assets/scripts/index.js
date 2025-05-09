// Estado da aplicação
let carrinho = [];

// Classe para gerenciar o carrinho
class CarrinhoItem {
    constructor(id, nome, preco, quantidade = 1) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.quantidade = quantidade;
    }

    get total() {
        return this.preco * this.quantidade;
    }
}

// Funções do carrinho
function adicionarAoCarrinho(id, nome, preco) {
    const itemExistente = carrinho.find(item => item.id === id);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push(new CarrinhoItem(id, nome, preco));
    }
    
    atualizarCarrinho();
}

function removerDoCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    atualizarCarrinho();
}

function atualizarQuantidade(id, quantidade) {
    const item = carrinho.find(item => item.id === id);
    if (item) {
        item.quantidade = Math.max(1, quantidade);
        atualizarCarrinho();
    }
}

function atualizarCarrinho() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Atualiza o contador do carrinho
    cartCount.textContent = carrinho.reduce((total, item) => total + item.quantidade, 0);
    
    // Atualiza os itens do carrinho
    cartItems.innerHTML = carrinho.map(item => `
        <div class="cart-item d-flex justify-content-between align-items-center mb-3">
            <div>
                <h6 class="mb-0">${item.nome}</h6>
                <p class="mb-0">R$ ${item.preco.toFixed(2)} x ${item.quantidade}</p>
            </div>
            <div class="d-flex align-items-center">
                <button class="btn btn-sm btn-outline-secondary me-2" onclick="atualizarQuantidade(${item.id}, ${item.quantidade - 1})">-</button>
                <span class="mx-2">${item.quantidade}</span>
                <button class="btn btn-sm btn-outline-secondary ms-2" onclick="atualizarQuantidade(${item.id}, ${item.quantidade + 1})">+</button>
                <button class="btn btn-sm btn-danger ms-3" onclick="removerDoCarrinho(${item.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `).join('') || '<p class="text-center">Seu carrinho está vazio</p>';
    
    // Atualiza o total
    const total = carrinho.reduce((sum, item) => sum + item.total, 0);
    cartTotal.textContent = `R$ ${total.toFixed(2)}`;
}

// Função para pesquisar pizzas
function pesquisarPizzas(termo) {
    const pizzaCards = document.querySelectorAll('.pizza-card');
    
    pizzaCards.forEach(card => {
        const titulo = card.querySelector('h3').textContent.toLowerCase();
        const descricao = card.querySelector('p').textContent.toLowerCase();
        const termoPesquisa = termo.toLowerCase();
        
        if (titulo.includes(termoPesquisa) || descricao.includes(termoPesquisa)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Botões de adicionar ao carrinho
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.promo-card, .pizza-card'); // Modificado para aceitar ambas as classes
            if (card) { // Verifica se o card foi encontrado
                const nome = card.querySelector('h3').textContent;
                const precoText = card.querySelector('.price').textContent;
                const preco = parseFloat(precoText.replace('R$ ', '').replace(',', '.')); // Adicionado replace para vírgula
                const id = nome + '-' + preco; // Usar uma combinação de nome e preço para um ID mais único

                adicionarAoCarrinho(id, nome, preco);
            
                // Feedback visual
                const originalText = button.textContent;
                button.textContent = 'Adicionado!';
                button.disabled = true;
            
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                }, 1000);
            }
        });
    });

    // Modal do carrinho
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    
    document.getElementById('cartButton').addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.show();
    });

    // Botão de finalizar pedido
    document.getElementById('checkoutButton').addEventListener('click', () => {
        if (carrinho.length === 0) {
            alert('Adicione itens ao carrinho antes de finalizar o pedido.');
            return;
        }
        
        // if (!isLoggedIn) {
        //     window.location.href = 'login.html';
        //     return;
        // }
        
        // Salva os itens do carrinho no localStorage
        localStorage.setItem('cartItems', JSON.stringify(carrinho));
        
        // Aqui você implementaria a lógica de checkout
        window.location.href = 'modules/pedido.html';
        // alert('Pedido finalizado com sucesso!');
        // carrinho = [];
        // atualizarCarrinho();
        // cartModal.hide();
    });


    //Verificação de login
        const token = localStorage.getItem('jwtToken');
        let isLoggedIn = false;
        let userRole = null;

        if (token) {
            try {
                const decoded = jwt_decode(token); // Ensure jwt_decode is available
                const currentTime = Date.now() / 1000;

                if (decoded.exp && decoded.exp > currentTime) {
                    isLoggedIn = true;
                    userRole = decoded.role; // Assuming 'role' is in your JWT payload
                } else {
                    // Token expirado - remova do localStorage
                    console.log("Sessão expirou.");
                    localStorage.removeItem('jwtToken');
                }
            } catch (error) {
                console.error('Token inválido ou malformado', error);
                localStorage.removeItem('jwtToken');
            }
        }

        // Adicionar link "Cadastrar Pizza" se for admin
        if (isLoggedIn && userRole === 'ADMIN') {
            const navbarNav = document.querySelector('#navbarNav .navbar-nav');
            if (navbarNav) {
                const cadastrarPizzaLi = document.createElement('li');
                cadastrarPizzaLi.classList.add('nav-item');
                cadastrarPizzaLi.innerHTML = `<a class="nav-link" href="./modules/cadastroPizza.html">Cadastrar Pizza</a>`;
                
                // Inserir antes do último item (ou ajustar conforme necessário)
                // Se houver um ícone de usuário ou carrinho, pode ser antes deles
                const userProfileLink = document.getElementById('userProfileLink'); // Assuming your user icon/link has this ID
                if (userProfileLink && userProfileLink.parentElement.classList.contains('nav-item')) {
                    navbarNav.insertBefore(cadastrarPizzaLi, userProfileLink.parentElement);
                } else {
                     // Fallback: Adiciona ao final da lista de navegação principal se não encontrar um ponto específico
                    const lastNavItem = navbarNav.querySelector('.nav-right') || navbarNav.lastElementChild;
                    if (lastNavItem) {
                         navbarNav.insertBefore(cadastrarPizzaLi, lastNavItem);
                    } else {
                        navbarNav.appendChild(cadastrarPizzaLi); // Append if no other items or specific target
                    }
                }
            }
        }

        const userProfileElement = document.getElementById('userProfile');
        if (userProfileElement) {
            userProfileElement.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = isLoggedIn ? './modules/userInfo.html' : './modules/login.html';
            });
        }


    // Inicialização do carrinho
    atualizarCarrinho();

    // Pesquisa de pizzas
    const searchInput = document.getElementById('searchPizza');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            pesquisarPizzas(e.target.value);
        });
    }
});

// Manipuladores dos botões de reordenar
document.querySelectorAll('.btn-primary').forEach(button => {
    button.addEventListener('click', (e) => {
        const orderItem = e.target.closest('.order-item');
        const pizzaName = orderItem.querySelector('h3').textContent;
        const price = orderItem.querySelector('p').textContent;
        
        // Aqui você pode adicionar a lógica para reordenar a pizza
        console.log(`Reordenando: ${pizzaName} - ${price}`);
    });
});

// Manipuladores da navegação inferior
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        // Remove a classe active de todos os itens
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        // Adiciona a classe active ao item clicado
        e.currentTarget.classList.add('active');
    });
});