document.addEventListener('DOMContentLoaded', function () {
    loadUserProfile();
    checkOrderHistory();
});

async function loadUserProfile() {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        console.error("JWT token not found.");
        // Optionally redirect to login or show an error message to the user
        document.getElementById('userFullName').textContent = "Error loading profile.";
        document.getElementById('userEmail').textContent = "Not logged in.";
        document.getElementById('userPhone').textContent = "-";
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/usuario/perfil", { // Moved inside function
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
            // Handle HTTP errors like 401 Unauthorized, 403 Forbidden, etc.
            console.error("Failed to fetch user profile:", response.status, await response.text());
            document.getElementById('userFullName').textContent = "Error loading profile.";
            document.getElementById('userEmail').textContent = `Error: ${response.status}`;
            document.getElementById('userPhone').textContent = "-";
            if (response.status === 401 || response.status === 403) {
                // e.g., redirect to login page
                // window.location.href = '/login.html';
            }
            return;
        }

        const perfil = await response.json();

        // Assuming the JSON response has fields: Nome, Email, Telefone
        // Adjust field names if they are different in your actual API response
        document.getElementById('userFullName').textContent = perfil.nome || "N/A";
        document.getElementById('userEmail').textContent = perfil.email || "N/A";
        document.getElementById('userPhone').textContent = perfil.telefone || "N/A";
        // Role is available in perfil.role, you can display it if you add an element for it.
        // console.log("User Role:", perfil.role); 
        // Address is not in the provided JSON structure (Nome, Email, Telefone, Role)
        // document.getElementById('userAddress').textContent = perfil.endereco || "Not provided";


    } catch (error) {
        console.error("Error fetching or parsing user profile:", error);
        document.getElementById('userFullName').textContent = "Error loading profile.";
        document.getElementById('userEmail').textContent = "Could not fetch data.";
        document.getElementById('userPhone').textContent = "-";
    }
}

function checkOrderHistory() {
    const orderHistoryList = document.querySelector('.order-history-list');
    const noOrdersMessage = document.querySelector('.no-orders');
    if (orderHistoryList && noOrdersMessage) {
        let hasActualOrders = false;
        for (let i = 0; i < orderHistoryList.children.length; i++) {
            if (orderHistoryList.children[i].classList.contains('order-item')) {
                hasActualOrders = true;
                break;
            }
        }
        if (!hasActualOrders) {
            noOrdersMessage.style.display = 'block';
        } else {
            noOrdersMessage.style.display = 'none';
        }
    }
}

// Removed the standalone fetch call as it's now inside loadUserProfile
// async function (params) { // This was an incomplete function structure
// }
// const token = localStorage.getItem("jwtToken"); // Moved inside function

// const response = await fetch("http://localhost:8080/usuario/perfil", { // Moved inside function
//   headers: {
//     Authorization: `Bearer ${token}`
//   }
// });

// const perfil = await response.json(); // Moved inside function