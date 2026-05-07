document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    console.log('AUTH UI LOADED');
});

function updateAuthUI() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const signInBtn = document.getElementById('signIn');
    const createAccBtn = document.getElementById('createacc');

    if (!signInBtn || !createAccBtn) return;

    if (isLoggedIn) {
        const userName = localStorage.getItem('userName');

        signInBtn.textContent = userName;
        signInBtn.onclick = null;

        createAccBtn.textContent = 'Sign Out';
        createAccBtn.onclick = logout;
    } 
    
    else {
        signInBtn.textContent = 'Sign in';
        signInBtn.onclick = goToLogin;

        createAccBtn.textContent = 'Create account';
        createAccBtn.onclick = goToRegister;
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}