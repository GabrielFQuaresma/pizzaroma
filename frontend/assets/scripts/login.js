document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginErrorDiv = document.getElementById('loginError');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePasswordBtn');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            hideError();

            const email = emailInput.value;
            const password = passwordInput.value;

            if (!email || !password) {
                showError('Por favor, preencha o e-mail e a senha.');
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email, senha: password }),
                });

                const contentType = response.headers.get("content-type");

                if (response.ok) {
                    if (contentType && contentType.includes("application/json")) {
                        const data = await response.json();
                        console.log('Login successful:', data);
                        localStorage.setItem('jwtToken', data.token);
                        window.location.href = '../index.html';
                    } else {
                        // Successful response but not JSON. This is unexpected for a successful login.
                        const textData = await response.text();
                        console.error('Login successful but server response was not JSON. Status:', response.status, 'Response:', textData);
                        showError('Login bem-sucedido, mas resposta do servidor em formato inesperado.');
                    }
                } else {
                    // Error response from server (e.g., 400, 401, 500)
                    let errorMsg = `Erro ${response.status}: ${response.statusText}`; // Default error message

                    if (contentType && contentType.includes("application/json")) {
                        try {
                            const errorData = await response.json();
                            errorMsg = errorData.error || `Erro ${response.status}: ${errorData.message || response.statusText}`;
                            console.error('Login failed (JSON error response):', errorData);
                        } catch (jsonError) {
                            console.error('Login failed. Could not parse JSON error response. Status:', response.status, jsonError);
                            const textData = await response.text(); // Attempt to get text if JSON parsing failed
                            errorMsg = `Erro ${response.status}: Resposta do servidor não é JSON válido. Conteúdo: ${textData.substring(0, 100)}`;
                            console.error('Raw error response text:', textData);
                        }
                    } else {
                        // Error response was not JSON (e.g., HTML error page)
                        const textData = await response.text();
                        console.error('Login failed (Non-JSON error response). Status:', response.status, 'Response:', textData);
                        // Try to provide a snippet of the error or a generic message
                        if (textData && textData.length > 0 && textData.length < 300) {
                           errorMsg = `Erro ${response.status}. Resposta do servidor: ${textData.substring(0,150)}`;
                        } else if (textData.length >= 300) {
                           errorMsg = `Erro ${response.status}. O servidor retornou uma resposta extensa não JSON.`;
                        } else {
                           errorMsg = `Erro ${response.status} ao comunicar com o servidor.`;
                        }
                    }
                    showError(errorMsg);
                }
            } catch (error) { // Catches network errors or errors from await response.json()/text() if they throw
                console.error('Network error or critical issue during fetch:', error);
                let displayError = 'Erro de conexão. Não foi possível conectar ao servidor.';
                if (error instanceof TypeError && error.message === "Failed to fetch") { // Specific network error
                    displayError = 'Falha na conexão. Verifique sua internet e se o servidor está online.';
                } else if (error instanceof SyntaxError) { // Should be caught by specific JSON parsing checks above, but as a fallback
                    displayError = 'Erro ao processar a resposta do servidor (formato inválido).';
                }
                showError(displayError);
            }
        });
    }

    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const icon = togglePasswordBtn.querySelector('i');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        });
    }

    function showError(message) {
        if (loginErrorDiv) {
            loginErrorDiv.textContent = message;
            loginErrorDiv.style.display = 'block';
        } else {
            // Fallback if the error div is not found (though it should be)
            alert(message);
        }
    }

    function hideError() {
        if (loginErrorDiv) {
            loginErrorDiv.style.display = 'none';
            loginErrorDiv.textContent = '';
        }
    }
});
