document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const orderItems = document.getElementById('orderItems');
    // const addNewPizzaBtn = document.getElementById('addNewPizza'); // Removido
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

    // Helper function to calculate price for a single item
    function calculateItemPrice(item) {
        if (!item || !item.size || !PRICES.sizes[item.size]) {
            console.error("Invalid item or size for price calculation", item);
            return 0; // Default to 0 if item or size is invalid
        }
        let itemTotal = PRICES.sizes[item.size];
        if (item.border && PRICES.borders[item.border]) {
            itemTotal += PRICES.borders[item.border];
        }
        if (item.extras && Array.isArray(item.extras)) {
            item.extras.forEach(extra => {
                if (PRICES.extras[extra]) {
                    itemTotal += PRICES.extras[extra];
                }
            });
        }
        return itemTotal;
    }

    // Carregar itens do carrinho
    function loadCartItems() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        orderState.items = cartItems.map(item => ({
            id: item.id, // Preserve the original ID (expected to be saborId)
            name: item.nome || 'Pizza', // Use 'nome' from cart or a default
            size: item.size || 'medium', // Default if not set
            border: item.border || 'none', // Default if not set
            extras: item.extras || [], // Default if not set
            notes: item.notes || '', // Default if not set
            quantidade: item.quantidade || 1, // Default to 1 if not set
            // finalPrice will be calculated when item is loaded to form or saved
        }));

        renderOrderItems(); // Render items first

        if (orderState.items.length > 0) {
            selectItem(0); // Select the first item, which will also load it to form & calc price
        } else {
            calculateTotal(); // Calculate total (R$ 0,00) if cart is empty
        }
    }

    // Renderizar lista de itens
    function renderOrderItems() {
        orderItems.innerHTML = orderState.items.map((item, index) => {
            const currentPrice = item.finalPrice !== undefined ? item.finalPrice : calculateItemPrice(item);
            return `
            <div class="order-item ${index === orderState.selectedItemIndex ? 'selected' : ''}" 
                 onclick="selectItem(${index})">
                <h4>${item.name} (x${item.quantidade || 1})</h4> 
                <p>
                    ${item.size ? item.size.charAt(0).toUpperCase() + item.size.slice(1) : 'Tamanho não definido'} | 
                    ${item.border === 'none' ? 'Sem Borda' : `Borda de ${item.border.charAt(0).toUpperCase() + item.border.slice(1)}`}
                    ${item.extras && item.extras.length ? ` | Extras: ${item.extras.join(', ')}` : ''}
                </p>
                <p>Preço Unitário: R$ ${currentPrice.toFixed(2)}</p>
            </div>
        `}).join('');
    }

    // Selecionar item para edição
    window.selectItem = function(index) {
        orderState.selectedItemIndex = index;
        if (orderState.items[index]) {
            const item = orderState.items[index];
            // Ensure finalPrice is calculated if not already set
            if (item.finalPrice === undefined) {
                item.finalPrice = calculateItemPrice(item);
            }
            loadItemToForm(item);
        }
        renderOrderItems(); // Re-render to update selection highlight and potentially prices
        calculateTotal(); 
    };

    // Carregar item no formulário
    function loadItemToForm(item) {
        document.querySelector(`input[name="size"][value="${item.size || 'medium'}"]`).checked = true;
        document.querySelector(`input[name="border"][value="${item.border || 'none'}"]`).checked = true;
        document.querySelectorAll('input[name="extras"]').forEach(input => {
            input.checked = item.extras && item.extras.includes(input.value);
        });
        document.getElementById('notes').value = item.notes || '';
    }

    // Calcular preço total do pedido
    function calculateTotal() {
        const total = orderState.items.reduce((sum, item) => {
            const pricePerItem = item.finalPrice !== undefined ? item.finalPrice : calculateItemPrice(item);
            return sum + (pricePerItem * (item.quantidade || 1));
        }, 0);

        document.querySelector('.total-amount').textContent = `R$ ${total.toFixed(2)}`;
        return total;
    }

    // Salvar alterações do formulário
    customizationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (orderState.selectedItemIndex === null || !orderState.items[orderState.selectedItemIndex]) {
            alert("Nenhum item selecionado para salvar.");
            return;
        }

        const formData = new FormData(this);
        const item = orderState.items[orderState.selectedItemIndex];

        item.size = formData.get('size');
        item.border = formData.get('border');
        item.extras = Array.from(formData.getAll('extras'));
        item.notes = formData.get('notes');
        item.finalPrice = calculateItemPrice(item); // Calculate and store the final unit price

        renderOrderItems();
        calculateTotal();
        alert("Alterações salvas para " + item.name);
    });

    // Finalizar pedido
    finishOrderBtn.addEventListener('click', function() {
        if (orderState.items.length === 0) {
            alert('Adicione pelo menos uma pizza ao pedido!');
            return;
        }

        const itemsToStore = orderState.items.map(item => {
            const finalPrice = item.finalPrice !== undefined ? item.finalPrice : calculateItemPrice(item);
            // IMPORTANT: Ensure item.id is the numeric ID of the PizzaSabor
            if (typeof item.id !== 'number' && isNaN(parseInt(item.id))) {
                console.error(`CRITICAL: Item ID (idSabor) is not a number for ${item.name}. Found: ${item.id}. This will cause backend errors.`);
                alert(`Erro crítico: O ID do sabor para ${item.name} é inválido. Verifique o console para detalhes.`);
                // Potentially stop the process here if an ID is invalid
            }
            return {
                id: parseInt(item.id), // This is crucial, should be the Sabor ID
                nome: item.name,
                size: item.size || 'medium',
                border: item.border || 'none',
                extras: item.extras || [],
                notes: item.notes || '',
                quantidade: item.quantidade || 1,
                finalPrice: finalPrice, // Store the calculated unit price
            };
        });

        localStorage.setItem('cartItems', JSON.stringify(itemsToStore));
        
        window.location.href = 'pagamento.html';
    });

    // Inicialização
    loadCartItems();
    calculateTotal();
});
