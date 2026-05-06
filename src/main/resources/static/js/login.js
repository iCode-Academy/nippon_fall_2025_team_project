 async function handleLogin() {
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const btn = document.getElementById('loginBtn');
      const msg = document.getElementById('msg');

      msg.className = 'msg';
      msg.textContent = '';

      if (!email || !password) {
        msg.className = 'msg error';
        msg.textContent = 'Please enter your email and password.';
        return;
      }

      btn.textContent = 'Signing in...';
      btn.classList.add('loading');

      try {
        // URL нь таны Backend-ийн порттой (8080) яг таарах ёстой
        const res = await fetch('http://localhost:8080/api/user/login', {
          method: 'POST', // Энэ метод нь Backend-ийн @PostMapping-той таарах ёстой
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
      throw new Error("Login failed");
    }
 
    const user = await res.json();

    // hadgalna
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userId", user.id);
    localStorage.setItem("userName", user.name);

    msg.className = 'msg success';
    msg.textContent = "Login successful! Redirecting...";
 
    setTimeout(() => {
      const redirect = localStorage.getItem("redirectAfterLogin");

      if (redirect) {
        localStorage.removeItem("redirectAfterLogin");
        window.location.href = redirect;
      } else {
        window.location.href = 'index.html';
      }
    }, 1000);

      } catch (e) {
        msg.className = 'msg error';
        msg.textContent = 'Failed to connect to the server.';
      } finally {
        btn.textContent = 'Sign In';
        btn.classList.remove('loading');
      }
    }

    document.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleLogin();
    });

    