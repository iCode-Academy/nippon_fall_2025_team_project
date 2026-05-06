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

  const email =
    document
      .getElementById('loginEmail')
      .value
      .trim();

  const password =
    document
      .getElementById('loginPassword')
      .value;

  const btn =
    document
      .getElementById('loginBtn');

  const msg =
    document
      .getElementById('msg');

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
          email,
          password
        })
      }
    );

    if (!res.ok) {
      throw new Error();
    }

    const user = await res.json();

    localStorage.setItem(
      'isLoggedIn',
      'true'
    );

    localStorage.setItem(
      'userId',
      user.id
    );

    localStorage.setItem(
      'userName',
      user.name
    );

    localStorage.setItem(
      'userRole',
      user.role
    );

    msg.className = 'msg success';

    msg.textContent =
      'Login successful! Redirecting...';

    setTimeout(() => {

      window.location.href =
        'index.html';

    }, 1000);

  }
  catch {

    msg.className = 'msg error';

    msg.textContent =
      'Invalid email or password';
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

  const fill =
    document
      .getElementById('strength-fill');

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

  const name =
    document
      .getElementById('name')
      .value
      .trim();

  const email =
    document
      .getElementById('registerEmail')
      .value
      .trim();

  const role =
    document
      .getElementById('role')
      .value;

  const password =
    document
      .getElementById('registerPassword')
      .value;

  const confirm =
    document
      .getElementById('confirm')
      .value;

  const btn =
    document
      .getElementById('registerBtn');

  const msg =
    document
      .getElementById('msg');

  msg.style.display = 'none';

  const fields = [
    'name',
    'registerEmail',
    'registerPassword',
    'confirm'
  ];

  fields.forEach(id => {

    document
      .getElementById(id)
      .classList.remove('invalid');
  });

  let isValid = true;

  if (!name) {

    document
      .getElementById('name')
      .classList.add('invalid');

    isValid = false;
  }

  if (!email || !email.includes('@')) {

    document
      .getElementById('registerEmail')
      .classList.add('invalid');

    isValid = false;
  }

  if (password.length < 6) {

    document
      .getElementById('registerPassword')
      .classList.add('invalid');

    isValid = false;
  }

  if (password !== confirm) {

    document
      .getElementById('confirm')
      .classList.add('invalid');

    msg.className = 'msg error';

    msg.textContent =
      'Passwords do not match';

    return;
  }

  if (!isValid) return;

  btn.textContent = 'Processing...';

  btn.classList.add('loading');

  try {

    const response = await fetch(
      'http://localhost:8080/api/public/register',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          name,
          email,
          password,
          role
        })
      }
    );

    if (!response.ok) {
      throw new Error();
    }

    msg.className = 'msg success';

    msg.textContent =
      'Account created successfully';

    setTimeout(() => {

      showLogin();

    }, 1500);

  }
  catch {

    msg.className = 'msg error';

    msg.textContent =
      'Registration failed';
  }
  finally {

    btn.textContent = 'Sign Up';

    btn.classList.remove('loading');
  }
}