
window.onclick = function (event) {
    // Login хаах
    const lModal = document.getElementById('loginModal');
    if (lModal && event.target == lModal) {
        lModal.style.display = "none";
    }

    // Register хаах
    const rModal = document.getElementById('registerModal');
    if (rModal && event.target == rModal) {
        rModal.style.display = "none";
    }

    // Category хаах
    const cModal = document.getElementById('catModal');
    if (cModal && event.target == cModal) {
        cModal.style.display = "none";
    }
}