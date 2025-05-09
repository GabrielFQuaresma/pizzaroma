document.addEventListener('DOMContentLoaded', function () {
    const formCadastroPizza = document.getElementById('formCadastroPizza');
    const mensagemDiv = document.getElementById('mensagem');

    // Check if user is admin, otherwise redirect
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = '../index.html'; // Or to login page
        return;
    }

    try {
        const decodedToken = jwt_decode(token);
        if (!decodedToken || decodedToken.role !== 'ADMIN') {
            // Not an admin or token invalid, redirect or show error
            alert('Acesso negado. Você precisa ser um administrador para acessar esta página.');
            window.location.href = '../index.html';
            return;
        }
    } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        alert('Sessão inválida. Por favor, faça login novamente.');
        localStorage.removeItem('jwtToken');
        window.location.href = './login.html'; // Redirect to login
        return;
    }


    formCadastroPizza.addEventListener('submit', async function (event) {
        event.preventDefault();
        mensagemDiv.innerHTML = ''; // Clear previous messages

        const nome = document.getElementById('nomePizza').value.trim();
        const descricao = document.getElementById('descricaoPizza').value.trim();
        const precoBase = parseFloat(document.getElementById('precoBasePizza').value);
        const imagemUrl = document.getElementById('imagemUrlPizza').value.trim();

        if (!nome || !descricao || isNaN(precoBase) || precoBase <= 0 || !imagemUrl) {
            mostrarMensagem('Por favor, preencha todos os campos corretamente.', 'danger');
            return;
        }

        const pizzaData = {
            nome: nome,
            descricao: descricao,
            precoBase: precoBase,
            imagemUrl: imagemUrl
        };

        try {
            const response = await fetch(`${API_BASE_URL}/admin/sabores/adicionar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(pizzaData)
            });

            const responseBody = await response.text(); // Read as text first

            if (response.ok) {
                mostrarMensagem('Pizza cadastrada com sucesso!', 'success');
                formCadastroPizza.reset();
            } else {
                // Try to parse as JSON if it's an error, otherwise use the text
                let errorMessage = responseBody;
                try {
                    const errorJson = JSON.parse(responseBody);
                    errorMessage = errorJson.message || responseBody;
                } catch (e) {
                    // It wasn't JSON, stick with responseBody
                }
                mostrarMensagem(`Erro ao cadastrar pizza: ${response.status} - ${errorMessage}`, 'danger');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            mostrarMensagem('Não foi possível conectar ao servidor. Tente novamente mais tarde.', 'danger');
        }
    });

    function mostrarMensagem(msg, type = 'info') {
        mensagemDiv.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
                                    ${msg}
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                 </div>`;
    }
});
