document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('siakad_session') !== 'active') {
    window.location.href = '../index.html';
    return;
  }
  const name = localStorage.getItem('siakad_admin_name') || 'Administrator';
  document.querySelectorAll('[data-admin-name]').forEach(el => { el.textContent = name; });
  document.querySelectorAll('[data-today]').forEach(el => {
    el.textContent = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  });
  const currentFile = window.location.pathname.split('/').pop() || 'dashboard.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const target = link.getAttribute('href');
    if (target === currentFile) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const closeSidebar = () => { sidebar?.classList.remove('sidebar-open'); overlay?.classList.remove('show'); };
  menuToggle?.addEventListener('click', () => { sidebar?.classList.toggle('sidebar-open'); overlay?.classList.toggle('show'); });
  overlay?.addEventListener('click', closeSidebar);
  document.querySelectorAll('[data-logout]').forEach(button => button.addEventListener('click', () => {
    localStorage.removeItem('siakad_session');
    window.location.href = '../index.html';
  }));

  window.showToast = function (message, type = 'success') {
    let toast = document.getElementById('appToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'appToast';
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
    }
    toast.className = `toast toast-${type} visible`;
    toast.innerHTML = `<span class="material-symbols-rounded">${type === 'error' ? 'error' : 'check_circle'}</span><span>${message}</span>`;
    window.clearTimeout(window.__siakadToastTimer);
    window.__siakadToastTimer = window.setTimeout(() => toast.classList.remove('visible'), 2800);
  };
});
