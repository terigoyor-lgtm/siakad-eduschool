document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('studentRows');
  const search = document.getElementById('studentSearch');
  const classFilter = document.getElementById('classFilter');
  const statusFilter = document.getElementById('statusFilter');
  const countLabel = document.getElementById('recordCount');
  const modal = document.getElementById('deleteModal');
  let deleteId = null;

  window.SIAKAD.classes.forEach(className => {
    const option = document.createElement('option'); option.value = className; option.textContent = className; classFilter.appendChild(option);
  });

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }
  function render() {
    const query = search.value.trim().toLowerCase();
    const rows = window.SIAKAD.readStudents().filter(student => {
      const matchesSearch = [student.nis, student.name, student.className, student.email].some(value => String(value || '').toLowerCase().includes(query));
      const matchesClass = !classFilter.value || student.className === classFilter.value;
      const matchesStatus = !statusFilter.value || student.status === statusFilter.value;
      return matchesSearch && matchesClass && matchesStatus;
    });
    countLabel.textContent = `${rows.length} data siswa`;
    tableBody.innerHTML = rows.length ? rows.map(student => `
      <tr>
        <td><span class="checkbox-mock"></span></td>
        <td><div class="person-cell"><span class="avatar avatar-${student.gender === 'Perempuan' ? 'pink' : 'blue'}">${escapeHTML(student.name).split(' ').map(x => x[0]).slice(0,2).join('').toUpperCase()}</span><div><strong>${escapeHTML(student.name)}</strong><small>${escapeHTML(student.email || '-')}</small></div></div></td>
        <td class="mono">${escapeHTML(student.nis)}</td><td>${escapeHTML(student.className)}</td><td>${escapeHTML(student.gender)}</td>
        <td><span class="status status-${student.status === 'Aktif' ? 'active' : 'inactive'}">${escapeHTML(student.status)}</span></td>
        <td><div class="table-actions"><a class="icon-button" href="form.html?id=${student.id}" title="Edit ${escapeHTML(student.name)}" aria-label="Edit siswa"><span class="material-symbols-rounded">edit</span></a><button class="icon-button danger-icon" type="button" data-delete-id="${student.id}" title="Hapus ${escapeHTML(student.name)}" aria-label="Hapus siswa"><span class="material-symbols-rounded">delete</span></button></div></td>
      </tr>`).join('') : '<tr><td colspan="7" class="empty-cell"><span class="material-symbols-rounded">search_off</span><strong>Data tidak ditemukan</strong><span>Coba ubah kata kunci atau filter.</span></td></tr>';
  }

  search.addEventListener('input', render); classFilter.addEventListener('change', render); statusFilter.addEventListener('change', render);
  document.getElementById('resetFilters').addEventListener('click', () => { search.value = ''; classFilter.value = ''; statusFilter.value = ''; render(); });
  tableBody.addEventListener('click', event => {
    const button = event.target.closest('[data-delete-id]');
    if (!button) return;
    deleteId = Number(button.dataset.deleteId);
    const student = window.SIAKAD.readStudents().find(item => Number(item.id) === deleteId);
    document.getElementById('deleteStudentName').textContent = student?.name || 'siswa ini';
    modal.classList.add('modal-open'); modal.setAttribute('aria-hidden', 'false');
  });
  const closeModal = () => { modal.classList.remove('modal-open'); modal.setAttribute('aria-hidden', 'true'); deleteId = null; };
  modal.querySelectorAll('[data-modal-close]').forEach(button => button.addEventListener('click', closeModal));
  document.getElementById('confirmDelete').addEventListener('click', () => {
    if (deleteId !== null) { window.SIAKAD.deleteStudent(deleteId); closeModal(); render(); window.showToast('Data siswa berhasil dihapus.'); }
  });
  render();
});
