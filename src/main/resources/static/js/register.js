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
      fill.style.background = score <= 1 ? '#e24b4a' : score <= 3 ? '#ef9f27' : '#1d9e75';
    }

    async function handleRegister() {
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const role = document.getElementById('role').value;
      const password = document.getElementById('password').value;
      const confirm = document.getElementById('confirm').value;
      const btn = document.getElementById('registerBtn');
      const msg = document.getElementById('msg');

      msg.style.display = 'none';
      const fields = ['name', 'email', 'password', 'confirm'];
      fields.forEach(id => {
        document.getElementById(id).classList.remove('invalid');
        const hintId = id === 'password' ? 'pass-hint' : id === 'confirm' ? 'confirm-hint' : id + '-hint';
        const hint = document.getElementById(hintId);
        if (hint) hint.classList.remove('show');
      });

      let isValid = true;

      if (!name) {
        document.getElementById('name').classList.add('invalid');
        document.getElementById('name-hint').classList.add('show');
        isValid = false;
      }
      if (!email || !email.includes('@')) {
        document.getElementById('email').classList.add('invalid');
        document.getElementById('email-hint').classList.add('show');
        isValid = false;
      }
      if (password.length < 6) {
        document.getElementById('password').classList.add('invalid');
        document.getElementById('pass-hint').classList.add('show');
        isValid = false;
      }
      if (password !== confirm) {
        document.getElementById('confirm').classList.add('invalid');
        document.getElementById('confirm-hint').classList.add('show');
        isValid = false;
      }

      if (!isValid) return;

      btn.textContent = 'Processing...';
      btn.classList.add('loading');

      try {
        const response = await fetch('http://localhost:8080/api/user/register', { // Хаягийг бүтэн болгох
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role })
        });

        const resultText = await response.text();

        if (response.ok) {
          msg.className = 'msg success';
          msg.textContent = "Account created successfully! Redirecting...";
          msg.style.display = 'block';
          setTimeout(() => { window.location.href = 'login.html'; }, 2000);
        } else {
          msg.className = 'msg error';
          msg.textContent = resultText || "An error occurred during registration.";
          msg.style.display = 'block';
        }
      } catch (e) {
        msg.className = 'msg error';
        msg.textContent = "Could not connect to the server.";
        msg.style.display = 'block';
      } finally {
        btn.textContent = 'Sign Up';
        btn.classList.remove('loading');
      }
    }

    document.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleRegister();
    });