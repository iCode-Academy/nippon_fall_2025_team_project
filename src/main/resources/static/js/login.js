// =========================
// SCREEN SWITCH
// =========================
function showRegister() {
  document
    .getElementById('loginCard')
    .classList.add('hidden');
  document
    .getElementById('registerCard')
    .classList.remove('hidden');
}

function showLogin() {
  document
    .getElementById('registerCard')
    .classList.add('hidden');
  document
    .getElementById('loginCard')
    .classList.remove('hidden');
}


// =========================
// LOGIN
// =========================
async function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const btn = document.getElementById('loginBtn');
  const msg = document.getElementById('msg');
  msg.className = 'msg';
  msg.textContent = '';
  if (!email || !password) {
    msg.className = 'msg error';
    msg.textContent =
      'Please enter email and password';
    return;
  }

  btn.textContent = 'Signing In...';
  btn.classList.add('loading');

  try {
    const res = await fetch(
      'http://localhost:8080/api/public/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }
    const user = await res.json();
    console.log("Backend-ээс ирсэн өгөгдөл:", user);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userName', user.name || user.username);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userRole', user.role);
    console.log("LocalStorage хадгалагдлаа:", localStorage.getItem('userName'));

    msg.className = 'msg success';
    msg.textContent = 'Login successful! Redirecting...';

    setTimeout(() => {
      if (user.role === 'ADMIN') {
        window.location.href = 'index.html';
      }
      else if (
        user.role === 'RESTAURANT'
      ) {
        window.location.href = 'index.html';
      }

      else {
        const redirect =
          localStorage.getItem('redirectAfterLogin');
        if (redirect) {
          localStorage.removeItem('redirectAfterLogin');
          window.location.href = redirect;
        }
        else {
          window.location.href =
            'index.html';
        }
      }
    }, 1000);
  }

  catch (error) {
    msg.className = 'msg error';
    msg.textContent = error.message;
  }
  finally {
    btn.textContent = 'Sign In';
    btn.classList.remove('loading');
  }
}

// =========================
// PASSWORD STRENGTH
// =========================
function checkStrength(val) {
  const fill = document.getElementById('strength-fill');
  let score = 0;
  if (val.length >= 6) score++;
  if (val.length >= 10) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const pct = (score / 5) * 100;

  fill.style.width = pct + '%';

  fill.style.background =
    score <= 1
      ? '#e24b4a'
      : score <= 3
        ? '#ef9f27'
        : '#1d9e75';
}

// =========================
// REGISTER
// =========================
async function handleRegister() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  const role = document.getElementById('role').value;
  const confirm = document.getElementById('confirm').value;
  console.log({
    name,
    email,
    password,
    role
  });

  const btn = document.getElementById('registerBtn');
  const msg = document.getElementById('registerMsg');
  msg.className = 'msg';
  msg.textContent = '';
  const fields = [
    'name',
    'registerEmail',
    'registerPassword',
    'confirm'
  ];
  fields.forEach(id => {
    document
      .getElementById(id)
      .classList.remove(
        'invalid'
      );
  });

  let isValid = true;

  if (!name) {
    document
      .getElementById('name')
      .classList.add(
        'invalid'
      );
    isValid = false;
  }
  if (
    !email ||
    !email.includes('@')
  ) {
    document
      .getElementById(
        'registerEmail'
      )
      .classList.add(
        'invalid'
      );
    isValid = false;
  }
  if (password.length < 6) {
    document
      .getElementById(
        'registerPassword'
      )
      .classList.add(
        'invalid'
      );
    isValid = false;
  }
  if (password !== confirm) {
    document
      .getElementById(
        'confirm'
      )
      .classList.add(
        'invalid'
      );
    msg.className =
      'msg error';
    msg.textContent =
      'Passwords do not match';
    return;
  }
  if (!isValid) {
    msg.className =
      'msg error';
    msg.textContent =
      'Please fill all fields correctly';
    return;
  }
  btn.textContent =
    'Processing...';
  btn.classList.add(
    'loading'
  );
  try {
    const response = await fetch(
      'http://localhost:8080/api/public/register',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          role: role      // "CUSTOMER" / "RESTAURANT" / "ADMIN"
        })
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server алдаа:", errorText); // ← ЭНД console-д харна
      throw new Error(errorText);
    }
    msg.className =
      'msg success';
    msg.textContent =
      'Account created successfully';
    setTimeout(() => {
      showLogin();
    }, 1500);
  }
  catch (error) {
    msg.className =
      'msg error';
    msg.textContent =
      error.message;
  }
  finally {
    btn.textContent =
      'Sign Up';
    btn.classList.remove(
      'loading'
    );
  }
}
// =========================
// HASH REGISTER
// =========================
window.addEventListener(
  'load',
  () => {
    if (
      window.location.hash ===
      '#register'
    ) {
      showRegister();
    }
  }
);

console.log("clicked");