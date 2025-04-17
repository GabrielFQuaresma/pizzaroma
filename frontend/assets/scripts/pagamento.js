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
        const orderItems = document.querySelector('.order-items');
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        orderItems.innerHTML = cartItems.map(item => `
            <div class="order-item">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${item.description || ''}</p>
                </div>
                <div class="item-price">
                    R$ ${item.price.toFixed(2)}
                </div>
            </div>
        `).join('');

        // Atualizar totais
        const subtotal = cartItems.reduce((total, item) => total + item.price, 0);
        const delivery = 10.00; // Taxa de entrega fixa
        const total = subtotal + delivery;

        document.querySelector('.subtotal span:last-child').textContent = `R$ ${subtotal.toFixed(2)}`;
        document.querySelector('.total span:last-child').textContent = `R$ ${total.toFixed(2)}`;
        document.querySelector('.total-amount').textContent = `R$ ${total.toFixed(2)}`;
    }

    // Carregar itens do pedido ao iniciar a página
    loadOrderItems();

    // Submissão do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Aqui você implementará a lógica de envio do pedido
        const formData = new FormData(this);
        const orderData = {
            address: {
                cep: formData.get('cep'),
                street: formData.get('rua'),
                number: formData.get('numero'),
                complement: formData.get('complemento'),
                neighborhood: formData.get('bairro'),
                city: formData.get('cidade')
            },
            payment: {
                method: formData.get('paymentMethod'),
                cardInfo: formData.get('paymentMethod') === 'credit' ? {
                    number: formData.get('cardNumber'),
                    expiry: formData.get('cardExpiry'),
                    cvv: formData.get('cardCvv'),
                    name: formData.get('cardName')
                } : null,
                changeAmount: formData.get('paymentMethod') === 'money' ? formData.get('changeAmount') : null
            },
            items: JSON.parse(localStorage.getItem('cartItems')) || []
        };

        console.log('Dados do pedido:', orderData);
        // Aqui você enviará os dados para seu backend
        
        // Limpar carrinho após finalizar o pedido
        localStorage.removeItem('cartItems');
        
        // Redirecionar para página de confirmação
        // window.location.href = 'confirmacao.html';
    });
});
