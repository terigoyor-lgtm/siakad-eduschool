document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const error = document.getElementById('loginError');
  const password = document.getElementById('password');
  const toggle = document.querySelector('.password-toggle');

  if (localStorage.getItem('siakad_session') === 'active') {
    window.location.href = 'pages/dashboard.html';
  }

  toggle?.addEventListener('click', () => {
    const isPassword = password.type === 'password';
    password.type = isPassword ? 'text' : 'password';
    toggle.innerHTML = `<span class="material-symbols-rounded">${isPassword ? 'visibility_off' : 'visibility'}</span>`;
    toggle.setAttribute('aria-label', isPassword ? 'Sembunyikan password' : 'Tampilkan password');
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const pass = password.value;
    if (username === 'admin' && pass === 'admin123') {
      localStorage.setItem('siakad_session', 'active');
      localStorage.setItem('siakad_admin_name', 'Administrator');
      window.location.href = 'pages/dashboard.html';
    } else {
      error.textContent = 'Username atau password tidak sesuai. Coba akun demo yang tersedia.';
      password.focus();
    }
  });
});
