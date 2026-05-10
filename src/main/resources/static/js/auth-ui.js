document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    console.log('AUTH UI LOADED');
});

function updateAuthUI() {

    const isLoggedIn =
        localStorage.getItem('isLoggedIn') === 'true';

    const signInBtn =
        document.getElementById('signIn');

    const createAccBtn =
        document.getElementById('createacc');

    if (!signInBtn || !createAccBtn) return;

    if (isLoggedIn) {

        const userName =
            localStorage.getItem('userName');

        signInBtn.textContent =
            userName;

        signInBtn.onclick =
            goToProfile;

        createAccBtn.textContent =
            'Sign Out';

        createAccBtn.onclick =
            logout;
    }

    else {

        signInBtn.textContent =
            'Sign in';

        signInBtn.onclick =
            goToLogin;

        createAccBtn.textContent =
            'Create account';

        createAccBtn.onclick =
            goToRegister;
    }
}

function goToProfile() {

    window.location.href =
        'profile.html';
}

function logout() {

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');

    window.location.href =
        'index.html';
}

// Batja:

const role = localStorage.getItem("userRole");

if (role != "ADMIN") {
  
  document.querySelectorAll(".admin-only").forEach((el) => {
    el.style.display = "none";
  });

}