// Verificar sesión al cargar cualquier página
function checkSession() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Guardar usuario en sesión
function saveSession(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Cerrar sesión
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Verificar si estamos en la página de inicio
if (window.location.pathname.includes('index.html')) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('auth-area').style.display = 'none';
        document.getElementById('register-area').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        document.getElementById('user-name').textContent = currentUser.name;
    }
}