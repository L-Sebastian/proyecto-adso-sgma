document.addEventListener("DOMContentLoaded", function () {

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const table = document.getElementById("userTable");

    function renderUsers() {
        table.innerHTML = "";

        users.forEach((user, index) => {
        table.innerHTML += `
        <tr>
            <td>${user.firstName} ${user.secondName || ""}</td>
            <td>${user.firstLastName} ${user.secondLastName || ""}</td>
            <td>${user.email}</td>
            <td>${user.departamento || ""}</td>
            <td>${user.telefono || ""}</td>
            <td>
                <div class="manage__user__action">

                    <button class="view-btn" data-index="${index}">Ver</button>

                    <!-- Dropdown Rol -->
                    <div class="role-dropdown">
                        <button class="role-btn">Rol: ${user.role || "user"} ▾</button>
                        <div class="role-menu">
                            <p data-role="admin" data-index="${index}">Admin</p>
                            <p data-role="seller" data-index="${index}">Seller</p>
                            <p data-role="user" data-index="${index}">User</p>
                        </div>
                    </div>

                    <button class="delete-btn" data-index="${index}">Eliminar</button>

                </div>
            </td>
        </tr>
      `;
    });

    // IMPORTANTE: agregar eventos DESPUÉS de renderizar
        addEvents();
    }

    function addEvents() {
        
    const btnBack = document.querySelector('.btnGoBack');

    if (btnBack) btnBack.addEventListener('click', function () { window.history.back(); 
        window.location.href = '/frontend/public/views/index_seller.html';
    });

    // VER
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.dataset.index;
            const user = users[index];
            window.location.href = "/frontend/public/views/views_edit_profile.html";
            alert(`Usuario: ${user.firstName} ${user.secondName} ${user.firstLastName} ${user.secondLastName} \nEmail: ${user.email} \nDepartamento: ${user.departamento} \nTeléfono: ${user.telefono} `);
        });
    });

    // ELIMINAR
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.dataset.index;

        if (confirm("¿Eliminar usuario?")) {
            users.splice(index, 1);
            localStorage.setItem("users", JSON.stringify(users));
            renderUsers();
            }
        });
    });

    // DROPDOWN
    document.querySelectorAll('.role-dropdown').forEach(dropdown => {
        const btn = dropdown.querySelector('.role-btn');
        const menu = dropdown.querySelector('.role-menu');

        btn.addEventListener('click', () => {
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });

        menu.querySelectorAll('p').forEach(option => {
        option.addEventListener('click', () => {
            const role = option.dataset.role;
            const index = option.dataset.index;

            users[index].role = role;
            localStorage.setItem("users", JSON.stringify(users));

            renderUsers(); // 🔥 refresca UI
            });
        });

        document.addEventListener('click', e => {
        if (!dropdown.contains(e.target)) {
            menu.style.display = 'none';
            }
        });
    });
  }

    renderUsers();
});