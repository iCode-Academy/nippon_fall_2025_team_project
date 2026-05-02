  // Элемент барьж авах
        const loginModal = document.getElementById('loginModal');
        const registerModal = document.getElementById('registerModal');
        const signInBtn = document.getElementById('signIn');
        const createAccBtn = document.getElementById('createacc');

        // Модол нээх
        signInBtn.onclick = function() {
            loginModal.style.display = "block";
        }

        createAccBtn.onclick = function() {
            registerModal.style.display = "block";
        }

        // Модол хаах 
        function closeLoginModal() {
            loginModal.style.display = "none";
        }

        function closeRegisterModal() {
            registerModal.style.display = "none";
        }

        // Гадна талас хаах. Энэ хэсгийг AIдсан хаха
        window.onclick = function(event) {
            if (event.target == loginModal) {
                loginModal.style.display = "none";
            }
            if (event.target == registerModal) {
                registerModal.style.display = "none";
            }
            if (typeof catModal !== 'undefined' && event.target == catModal) {
                catModal.style.display = "none";
            }
        }