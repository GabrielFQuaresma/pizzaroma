function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleBtn = passwordInput.nextElementSibling.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.classList.replace('bi-eye', 'bi-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleBtn.classList.replace('bi-eye-slash', 'bi-eye');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');

    // Attach togglePassword to buttons dynamically if they exist
    document.querySelectorAll('.toggle-password').forEach(button => {
        const inputId = button.previousElementSibling.id;
        if (inputId) {
            button.onclick = () => togglePassword(inputId);
        }
    });

    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const nome = nameInput.value.trim();
            const email = emailInput.value.trim();
            const telefone = phoneInput.value.replace(/\D/g, ''); // Remove non-numeric characters
            const senha = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (!nome || !email || !telefone || !senha || !confirmPassword) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            if (senha !== confirmPassword) {
                alert('As senhas não coincidem!');
                return;
            }

            if (!termsCheckbox.checked) {
                alert('Você deve aceitar os Termos de Uso e Política de Privacidade.');
                return;
            }

            const registerData = {
                nome: nome,
                email: email,
                telefone: telefone,
                senha: senha,
                role: "CLIENTE" // Default role for frontend registration
            };

            try {
                const response = await fetch('http://localhost:8080/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(registerData)
                });

                const responseBody = await response.text();

                if (response.ok) {
                    alert('Cadastro realizado com sucesso! ' + responseBody);
                    // Optionally, redirect to login page or clear form
                    // registerForm.reset(); 
                    window.location.href = '../index.html'; 
                } else {
                    alert('Erro no cadastro: ' + responseBody);
                }
            } catch (error) {
                console.error('Erro ao tentar registrar:', error);
                alert('Ocorreu um erro ao tentar realizar o cadastro. Verifique o console para mais detalhes.');
            }
        });
    }

    // Máscara para o telefone
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            
            if (value.length > 2) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            }
            if (value.length > 9 && value.length <= 10) { // (XX) XXXXX-XXXX (for 11 digits total with mask)
                 value = `${value.slice(0, 9)}-${value.slice(9)}`;
            } else if (value.length > 10) { // (XX) XXXXX-XXXX
                 value = `${value.slice(0,10)}-${value.slice(10)}`;
            }
            
            e.target.value = value;
        });
    }
});
