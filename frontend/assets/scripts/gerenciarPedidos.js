// API_BASE_URL deve estar definido em api.js e incluído antes deste script.

document.addEventListener('DOMContentLoaded', () => {
    const unauthorizedMessage = document.getElementById('unauthorizedMessage');
    const pedidosContainer = document.getElementById('pedidosContainer');
    const refreshButton = document.getElementById('refreshOrders');
    const logoutButton = document.getElementById('logoutButton');

    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('jwtToken');
            window.location.href = '../index.html'; // Ou página de login
        });
    }
    
    function checkAuthAndLoadOrders() {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            showUnauthorized();
            return;
        }

        try {
            const decoded = jwt_decode(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp && decoded.exp < currentTime) {
                localStorage.removeItem('jwtToken');
                showUnauthorized('Sessão expirada. Faça login novamente.');
                return;
            }

            const userRole = decoded.role;
            if (userRole !== 'ADMIN' && userRole !== 'FUNCIONARIO') {
                showUnauthorized();
                return;
            }

            // Se autorizado, oculta mensagem e mostra container de pedidos
            if (unauthorizedMessage) unauthorizedMessage.style.display = 'none';
            if (pedidosContainer) pedidosContainer.style.display = 'flex'; // 'flex' por causa do .row
            loadOrders(token);

        } catch (error) {
            console.error('Erro ao decodificar token:', error);
            localStorage.removeItem('jwtToken');
            showUnauthorized('Erro de autenticação.');
        }
    }

    function showUnauthorized(message = 'Você não tem permissão para acessar esta página.') {
        if (unauthorizedMessage) {
            unauthorizedMessage.textContent = message;
            unauthorizedMessage.style.display = 'block';
        }
        if (pedidosContainer) pedidosContainer.style.display = 'none';
    }

    async function loadOrders(token) {
        const pedidosPreparandoDiv = document.getElementById('pedidosPreparando');
        const pedidosSaiuParaEntregaDiv = document.getElementById('pedidosSaiuParaEntrega');

        if (!pedidosPreparandoDiv || !pedidosSaiuParaEntregaDiv) {
            console.error('Elementos do DOM para pedidos não encontrados.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/gerenciar-pedidos/ativos`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401 || response.status === 403) {
                showUnauthorized('Sua sessão expirou ou você não tem permissão. Faça login novamente.');
                localStorage.removeItem('jwtToken');
                return;
            }
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const pedidos = await response.json();
            displayOrders(pedidos, token);
        } catch (error) {
            console.error('Falha ao carregar pedidos:', error);
            pedidosPreparandoDiv.innerHTML = '<p class="text-danger text-center">Erro ao carregar pedidos.</p>';
            pedidosSaiuParaEntregaDiv.innerHTML = '';
        }
    }

    function displayOrders(pedidos, token) {
        const pedidosPreparandoDiv = document.getElementById('pedidosPreparando');
        const pedidosSaiuParaEntregaDiv = document.getElementById('pedidosSaiuParaEntrega');

        pedidosPreparandoDiv.innerHTML = ''; // Limpa antes de adicionar
        pedidosSaiuParaEntregaDiv.innerHTML = '';

        const pedidosPreparando = pedidos.filter(p => p.status === 'PREPARANDO');
        const pedidosSaiu = pedidos.filter(p => p.status === 'SAIU_PARA_ENTREGA');

        if (pedidosPreparando.length === 0) {
            pedidosPreparandoDiv.innerHTML = '<p class="text-muted empty-state">Nenhum pedido em preparo.</p>';
        } else {
            pedidosPreparando.forEach(pedido => {
                pedidosPreparandoDiv.appendChild(createPedidoCard(pedido, token));
            });
        }

        if (pedidosSaiu.length === 0) {
            pedidosSaiuParaEntregaDiv.innerHTML = '<p class="text-muted empty-state">Nenhum pedido a caminho.</p>';
        } else {
            pedidosSaiu.forEach(pedido => {
                pedidosSaiuParaEntregaDiv.appendChild(createPedidoCard(pedido, token));
            });
        }
    }

    function formatCurrency(value) {
        if (typeof value !== 'number' || isNaN(value)) {
            return 'R$ --,--'; // Ou qualquer valor padrão que você preferir
        }
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    }
    
    function createPedidoCard(pedido, token) {
        const card = document.createElement('div');
        card.className = 'pedido-card card';
        card.dataset.pedidoId = pedido.id;

        let itensHtml = '<ul class="list-unstyled mb-0">';
        if (pedido.itens && pedido.itens.length > 0) {
            pedido.itens.forEach(item => {
                const nomeSabor = item.sabor ? item.sabor.nome : (item.nomePizza || 'Sabor não especificado'); // Changed item.pizzaSabor to item.sabor
                const precoItem = item.precoUnitario !== undefined ? formatCurrency(item.precoUnitario * item.quantidade) : 'Preço indisponível';
                itensHtml += `<li class="item-pedido">${item.quantidade}x ${nomeSabor} - ${precoItem}</li>`;
            });
        } else {
            itensHtml += '<li class="item-pedido">Itens não detalhados.</li>';
        }
        itensHtml += '</ul>';

        const clienteInfo = pedido.cliente ? 
            (pedido.cliente.nomeCompleto || 'Nome não disponível') + (pedido.cliente.email ? ` (${pedido.cliente.email})` : '') :
            (pedido.nomeCliente || 'Cliente não identificado');
        
        const enderecoInfo = pedido.enderecoEntrega || 'Endereço não fornecido';

        card.innerHTML = `
            <div class="card-header">
                Pedido #${pedido.id} - ${formatDate(pedido.dataHora)}
            </div>
            <div class="card-body">
                <h5 class="card-title">Cliente: ${clienteInfo}</h5>
                <p><strong>Endereço:</strong> ${enderecoInfo}</p>
                <p><strong>Itens:</strong></p>
                ${itensHtml}
                <p class="total-pedido mt-2"><strong>Total:</strong> ${formatCurrency(pedido.valorTotal)}</p>
                <p><strong>Status Atual:</strong> <span class="fw-bold">${pedido.status.replace('_', ' ')}</span></p>
                <div class="mt-3">
                    ${pedido.status === 'PREPARANDO' ? 
                        `<button class="btn btn-sm btn-saiu-entrega btn-status w-100" data-action="SAIU_PARA_ENTREGA">Marcar como Saiu para Entrega</button>` : ''}
                    ${pedido.status === 'SAIU_PARA_ENTREGA' ? 
                        `<button class="btn btn-sm btn-entregue btn-status w-100" data-action="ENTREGUE">Marcar como Entregue</button>` : ''}
                </div>
            </div>
        `;

        card.querySelectorAll('.btn-status').forEach(button => {
            button.addEventListener('click', async () => {
                const novoStatus = button.dataset.action;
                await updateOrderStatus(pedido.id, novoStatus, token);
            });
        });
        return card;
    }

    async function updateOrderStatus(pedidoId, novoStatus, token) {
        try {
            const response = await fetch(`${API_BASE_URL}/gerenciar-pedidos/atualizar-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ pedidoId, novoStatus })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
            }
            
            // alert(`Status do pedido #${pedidoId} atualizado para ${novoStatus}!`);
            loadOrders(token); // Recarrega os pedidos para refletir a mudança
        } catch (error) {
            console.error('Falha ao atualizar status do pedido:', error);
            alert(`Erro ao atualizar status: ${error.message}`);
        }
    }

    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            const token = localStorage.getItem('jwtToken');
            if (token) {
                 try {
                    const decoded = jwt_decode(token);
                    const userRole = decoded.role;
                    if (userRole === 'ADMIN' || userRole === 'FUNCIONARIO') {
                         loadOrders(token);
                    } else {
                        showUnauthorized();
                    }
                } catch (e) {
                    showUnauthorized('Sessão inválida.');
                }
            } else {
                showUnauthorized('Você precisa estar logado.');
            }
        });
    }

    // Carga inicial
    checkAuthAndLoadOrders();
});
