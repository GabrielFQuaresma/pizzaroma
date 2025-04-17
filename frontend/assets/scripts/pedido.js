document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const orderItems = document.getElementById('orderItems');
    const addNewPizzaBtn = document.getElementById('addNewPizza');
    const customizationForm = document.getElementById('customizationForm');
    const finishOrderBtn = document.getElementById('finishOrder');
    
    // Preços base
    const PRICES = {
        sizes: {
            small: 39.90,
            medium: 49.90,
            large: 59.90
        },
        borders: {
            none: 0,
            cheese: 8.00,
            cheddar: 8.00
        },
        extras: {
            cheese: 5.00,
            pepperoni: 7.00,
            onion: 3.00
        }
    };

    // Estado do pedido
    let orderState = {
        items: [],
        selectedItemIndex: null
    };

    // Carregar itens do carrinho
    function loadCartItems() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        orderState.items = cartItems.map(item => ({
            ...item,
            size: 'medium',
            border: 'none',
            extras: [],
            notes: ''
        }));
        renderOrderItems();
    }

    // Renderizar lista de itens
    function renderOrderItems() {
        orderItems.innerHTML = orderState.items.map((item, index) => `
            <div class="order-item ${index === orderState.selectedItemIndex ? 'selected' : ''}" 
                 onclick="selectItem(${index})">
                <h4>${item.name}</h4>
                <p>
                    ${item.size.charAt(0).toUpperCase() + item.size.slice(1)} | 
                    ${item.border === 'none' ? 'Sem Borda' : `Borda de ${item.border}`}
                    ${item.extras.length ? ` | Extras: ${item.extras.join(', ')}` : ''}
                </p>
            </div>
        `).join('');
    }

    // Selecionar item para edição
    window.selectItem = function(index) {
        orderState.selectedItemIndex = index;
        renderOrderItems();
        loadItemToForm(orderState.items[index]);
    };

    // Carregar item no formulário
    function loadItemToForm(item) {
        // Tamanho
        document.querySelector(`input[name="size"][value="${item.size}"]`).checked = true;

        // Borda
        document.querySelector(`input[name="border"][value="${item.border}"]`).checked = true;

        // Extras
        document.querySelectorAll('input[name="extras"]').forEach(input => {
            input.checked = item.extras.includes(input.value);
        });

        // Observações
        document.getElementById('notes').value = item.notes || '';
    }

    // Calcular preço total do pedido
    function calculateTotal() {
        const total = orderState.items.reduce((sum, item) => {
            let itemTotal = PRICES.sizes[item.size];
            itemTotal += PRICES.borders[item.border];
            item.extras.forEach(extra => {
                itemTotal += PRICES.extras[extra];
            });
            return sum + itemTotal;
        }, 0);

        document.querySelector('.total-amount').textContent = `R$ ${total.toFixed(2)}`;
        return total;
    }

    // Adicionar nova pizza
    addNewPizzaBtn.addEventListener('click', function() {
        const newPizza = {
            name: 'Nova Pizza',
            size: 'medium',
            border: 'none',
            extras: [],
            notes: ''
        };
        orderState.items.push(newPizza);
        orderState.selectedItemIndex = orderState.items.length - 1;
        renderOrderItems();
        loadItemToForm(newPizza);
        calculateTotal();
    });

    // Salvar alterações do formulário
    customizationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (orderState.selectedItemIndex === null) return;

        const formData = new FormData(this);
        const item = orderState.items[orderState.selectedItemIndex];

        item.size = formData.get('size');
        item.border = formData.get('border');
        item.extras = Array.from(formData.getAll('extras'));
        item.notes = formData.get('notes');

        renderOrderItems();
        calculateTotal();
    });

    // Finalizar pedido
    finishOrderBtn.addEventListener('click', function() {
        if (orderState.items.length === 0) {
            alert('Adicione pelo menos uma pizza ao pedido!');
            return;
        }

        // Atualizar items no localStorage
        localStorage.setItem('cartItems', JSON.stringify(orderState.items));
        
        // Redirecionar para página de pagamento
        window.location.href = 'pagamento.html';
    });

    // Inicialização
    loadCartItems();
    calculateTotal();
});
