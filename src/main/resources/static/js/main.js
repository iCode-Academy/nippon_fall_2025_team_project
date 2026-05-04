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


//Recommend hesgiin js 
function toggleSortDropdown(event) {
    event.stopPropagation();
    document.getElementById('sortPopup').classList.toggle('open');
}

function cancelSort() {
    document.getElementById('sortPopup').classList.remove('open');
}

function applySort(event) {
       
    const selected = document.querySelector('input[name="sort"]:checked');
    const labels = {
        recommended: 'Recommended',
        az: 'Alphabetical (A–Z)',
        za: 'Alphabetical (Z–A)',
        distance: 'Distance'
    };
    document.getElementById('sortLabel').textContent = labels[selected.value];
    
     document.getElementById('sortPopup').classList.remove('open');
};

function cancelSort(event) {
    event.stopPropagation();
    document.getElementById('sortPopup').classList.remove('open');
}
document.querySelectorAll('.stars i').forEach((star, index, stars) => {
    // Hover hiinguut odnuud fill hiigdene
    star.addEventListener('mouseover', () => {
        stars.forEach((s, i) => {
            s.className = i <= index ? 'fas fa-star' : 'far fa-star';
        });
    });

    // Mouse-aa holduulahaar umnuh saved baisan helberluugee butsna
    star.addEventListener('mouseout', () => {
        const saved = parseInt(document.querySelector('.stars').dataset.rating || 0);
        stars.forEach((s, i) => {
            s.className = i < saved ? 'fas fa-star' : 'far fa-star';
        });
    });

    // CLick hiinguut hadgalna
    star.addEventListener('click', () => {
        document.querySelector('.stars').dataset.rating = index + 1;
        stars.forEach((s, i) => {
            s.className = i <= index ? 'fas fa-star' : 'far fa-star';
        });
    });
});