// Simple session helpers: use token-based session stored in localStorage
function checkSession() {
    const token = localStorage.getItem('token');
    return !!token;
}

function saveToken(token) {
    localStorage.setItem('token', token);
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

// Export for pages that include session.js directly (global functions)
window.checkSession = checkSession;
window.saveToken = saveToken;
window.logout = logout;