// Register modal нээх
function openRegisterModal() {
    document.getElementById('registerModal').style.display = 'flex';
}

// Register modal хаах
function closeRegisterModal() {
    document.getElementById('registerModal').style.display = 'none';
}

// Гадна дарахад хаах
document.getElementById('registerModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeRegisterModal();
    }
});