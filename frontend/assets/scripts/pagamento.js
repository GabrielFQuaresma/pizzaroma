document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário
    const form = document.getElementById('paymentForm');
    const creditCardFields = document.getElementById('creditCardFields');
    const changeField = document.getElementById('changeField');
    const paymentMethods = document.getElementsByName('paymentMethod');
    
    // Máscaras para os campos
    const cepInput = document.getElementById('cep');
    const cardNumberInput = document.getElementById('cardNumber');
    const cardExpiryInput = document.getElementById('cardExpiry');
    const cardCvvInput = document.getElementById('cardCvv');
    const changeAmountInput = document.getElementById('changeAmount');

    // Máscara para CEP
    cepInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        if (value.length > 5) {
            value = value.slice(0, 5) + '-' + value.slice(5);
        }
        e.target.value = value;
    });

    // Máscara para número do cartão
    cardNumberInput?.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 16) value = value.slice(0, 16);
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = value;
    });

    // Máscara para validade do cartão
    cardExpiryInput?.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) value = value.slice(0, 4);
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        e.target.value = value;
    });

    // Máscara para CVV
    cardCvvInput?.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 3) value = value.slice(0, 3);
        e.target.value = value;
    });

    // Máscara para valor do troco
    changeAmountInput?.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = (parseInt(value) / 100).toFixed(2);
        e.target.value = value.toString().replace('.', ',');
    });

    // Controle de exibição dos campos específicos de pagamento
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            creditCardFields.style.display = this.value === 'credit' ? 'block' : 'none';
            changeField.style.display = this.value === 'money' ? 'block' : 'none';

            // Atualiza required dos campos
            const creditInputs = creditCardFields.querySelectorAll('input');
            creditInputs.forEach(input => {
                input.required = this.value === 'credit';
            });

            const changeInput = changeField.querySelector('input');
            if (changeInput) {
                changeInput.required = this.value === 'money';
            }
        });
    });

    // Buscar endereço pelo CEP
    cepInput.addEventListener('blur', function() {
        const cep = this.value.replace(/\D/g, '');
        if (cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        document.getElementById('rua').value = data.logradouro;
                        document.getElementById('bairro').value = data.bairro;
                        document.getElementById('cidade').value = data.localidade;
                    }
                })
                .catch(error => console.error('Erro ao buscar CEP:', error));
        }
    });

    // Carregar itens do pedido do localStorage
    function loadOrderItems() {
        const orderItemsContainer = document.querySelector('.order-items');
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        if (!orderItemsContainer) {
            console.error("Element .order-items not found for displaying cart.");
            return;
        }

        orderItemsContainer.innerHTML = cartItems.map(item => `
            <div class="order-item">
                <div class="item-details">
                    <h4>${item.nome} (x${item.quantidade || 1})</h4>
                    <p>
                        Tamanho: ${item.size ? item.size.charAt(0).toUpperCase() + item.size.slice(1) : 'N/A'}<br>
                        Borda: ${item.border ? (item.border === 'none' ? 'Sem Borda' : item.border.charAt(0).toUpperCase() + item.border.slice(1)) : 'N/A'}<br>
                        ${item.extras && item.extras.length > 0 ? `Extras: ${item.extras.join(', ')}<br>` : ''}
                        ${item.notes ? `Obs: ${item.notes}` : ''}
                    </p>
                </div>
                <div class="item-price">
                    R$ ${(item.finalPrice * (item.quantidade || 1)).toFixed(2)}
                </div>
            </div>
        `).join('');

        // Atualizar totais
        const subtotal = cartItems.reduce((total, item) => total + (item.finalPrice * (item.quantidade || 1)), 0);
        const deliveryFee = 10.00; // Taxa de entrega fixa, pode ser dinâmica no futuro
        const total = subtotal + deliveryFee;

        const subtotalElement = document.querySelector('.subtotal span:last-child');
        const deliveryFeeElement = document.querySelector('.delivery-fee span:last-child');
        const totalElement = document.querySelector('.total span:last-child');
        const totalAmountButtonElement = document.querySelector('.total-amount');

        if (subtotalElement) subtotalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
        if (deliveryFeeElement) deliveryFeeElement.textContent = `R$ ${deliveryFee.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `R$ ${total.toFixed(2)}`;
        if (totalAmountButtonElement) totalAmountButtonElement.textContent = `R$ ${total.toFixed(2)}`;
    }

    // Carregar itens do pedido ao iniciar a página
    loadOrderItems();

    // Submissão do formulário
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        if (cartItems.length === 0) {
            alert('Seu carrinho está vazio. Adicione itens antes de finalizar o pedido.');
            return;
        }

        const token = localStorage.getItem('jwtToken'); 
        if (!token) {
            alert('Você não está logado. Por favor, faça login para continuar.');
            // window.location.href = '../modules/login.html'; // Descomente para redirecionar
            return;
        }

        const mappedItems = cartItems.map(item => {
            // IMPORTANT: item.id is expected to be the numeric ID of PizzaSabor
            if (typeof item.id !== 'number') {
                console.error(`Invalid idSabor for item: ${item.nome}. It should be a numeric ID. Found: ${item.id}`);
            }

            let tamanhoEnum;
            switch (item.size ? item.size.toLowerCase() : 'medium') {
                case 'small': tamanhoEnum = 'PEQUENA'; break;
                case 'medium': tamanhoEnum = 'MEDIA'; break;
                case 'large': tamanhoEnum = 'GRANDE'; break;
                default: tamanhoEnum = 'MEDIA'; // Default case
            }

            let bordaEnum;
            switch (item.border ? item.border.toLowerCase() : 'none') {
                case 'none': bordaEnum = 'VAZIA'; break;
                case 'cheese': bordaEnum = 'CATUPIRY'; break; // Assuming 'cheese' maps to CATUPIRY
                case 'cheddar': bordaEnum = 'CHEDDAR'; break;
                default: bordaEnum = 'VAZIA'; // Default case
            }

            return {
                idSabor: item.id, 
                tamanho: tamanhoEnum, 
                borda: bordaEnum, 
                ingredientesAdicionais: item.extras ? item.extras.join(', ') : '',
                observacoes: item.notes || '',
                quantidade: item.quantidade || 1,
                precoUnitario: item.finalPrice || 0 // Use finalPrice calculated in pedido.js
            };
        });

        let valorParaTroco = null;
        if (formData.get('paymentMethod') === 'money') {
            const changeAmountRaw = formData.get('changeAmount');
            if (changeAmountRaw) {
                // Remove "R$ ", then replace comma with dot for parseFloat
                valorParaTroco = parseFloat(changeAmountRaw.replace(/R\$\s*/, '').replace(',', '.'));
                if (isNaN(valorParaTroco)) {
                    alert("Valor para troco inválido.");
                    return;
                }
            }
        }

        const criarPedidoRequest = {
            itens: mappedItems,
            cep: formData.get('cep'),
            rua: formData.get('rua'), // Changed to formData.get()
            numero: formData.get('numero'),
            complemento: formData.get('complemento'),
            bairro: formData.get('bairro'), // Changed to formData.get()
            cidade: formData.get('cidade'), // Changed to formData.get()
            valorParaTroco: valorParaTroco
        };

        console.log('Enviando dados do pedido:', JSON.stringify(criarPedidoRequest, null, 2));

        try {
            const response = await fetch(`${API_BASE_URL}/pedido/criar`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(criarPedidoRequest)
            });

            if (response.ok) {
                const resultMessage = await response.text();
                alert(`Pedido criado com sucesso! ${resultMessage}`);
                localStorage.removeItem('cartItems'); 
                window.location.href = '../index.html'; 
            } else {
                const errorData = await response.text();
                console.error('Erro ao criar pedido:', response.status, errorData);
                alert(`Erro ao criar pedido: ${response.status} - ${errorData}. Verifique os dados e tente novamente.`);
            }
        } catch (error) {
            console.error('Erro de rede ou JavaScript ao criar pedido:', error);
            alert('Não foi possível conectar ao servidor para criar o pedido. Tente novamente mais tarde.');
        }
    });
});
