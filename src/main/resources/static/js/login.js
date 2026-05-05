const loginModal = document.getElementById('loginModal');
const signInBtn = document.getElementById('signIn');

// Sign in товч
if (signInBtn && loginModal) {
    signInBtn.onclick = function() {
        loginModal.style.display = 'flex'; // block → flex
    }
}

// Login modal хаах
function closeLoginModal() {
    loginModal.style.display = 'none';
}

// Login modal нээх (register-аас дуудагдана)
function openLoginModal() {
    loginModal.style.display = 'flex';
}

// Гадна дарахад хаах
loginModal.addEventListener('click', function(e) {
    if (e.target === this) {
        closeLoginModal();
    }
});

// postMessage сонсогч — register.html-с "openLogin" ирвэл
window.addEventListener('message', function(e) {
    if (e.data === 'openLogin') {
        closeRegisterModal();
        openLoginModal();
    }
    if (e.data === 'openRegister') {
        closeLoginModal();
        openRegisterModal();
    }
});