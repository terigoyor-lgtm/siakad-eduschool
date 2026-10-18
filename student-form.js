document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('studentForm');
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id')) || null;
  const students = window.SIAKAD.readStudents();
  const student = id ? students.find(item => Number(item.id) === id) : null;
  const classSelect = document.getElementById('className');
  window.SIAKAD.classes.forEach(className => { const opt = document.createElement('option'); opt.value = className; opt.textContent = className; classSelect.appendChild(opt); });

  if (id && !student) {
    document.getElementById('formPageTitle').textContent = 'Data siswa tidak ditemukan';
    document.getElementById('formPageDescription').textContent = 'Data mungkin sudah dihapus. Silakan kembali ke halaman data siswa.';
    form.querySelectorAll('input,select,button[type="submit"]').forEach(el => el.disabled = true);
  }

  if (student) {
    document.getElementById('formPageTitle').textContent = 'Edit Data Siswa';
    document.getElementById('formPageDescription').textContent = `Perbarui informasi untuk ${student.name}.`;
    document.getElementById('pageBreadcrumb').textContent = 'Edit Siswa';
    document.getElementById('nis').value = student.nis;
    document.getElementById('name').value = student.name;
    document.getElementById('gender').value = student.gender;
    document.getElementById('className').value = student.className;
    document.getElementById('email').value = student.email || '';
    document.getElementById('phone').value = student.phone || '';
    document.getElementById('status').value = student.status;
    document.getElementById('average').value = student.average ?? '';
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    clearErrors();
    const formData = {
      id: id || undefined,
      nis: document.getElementById('nis').value.trim(),
      name: document.getElementById('name').value.trim(),
      gender: document.getElementById('gender').value,
      className: document.getElementById('className').value,
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      status: document.getElementById('status').value,
      average: Number(document.getElementById('average').value)
    };
    let valid = true;
    if (!/^\d{4,12}$/.test(formData.nis)) { showError('nis', 'NIS harus berupa 4–12 digit angka.'); valid = false; }
    if (formData.name.length < 3) { showError('name', 'Nama minimal 3 karakter.'); valid = false; }
    if (!formData.gender) { showError('gender', 'Pilih jenis kelamin.'); valid = false; }
    if (!formData.className) { showError('className', 'Pilih kelas.'); valid = false; }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { showError('email', 'Format email belum benar.'); valid = false; }
    if (formData.average < 0 || formData.average > 100 || document.getElementById('average').value === '') { showError('average', 'Nilai rata-rata harus 0–100.'); valid = false; }
    const duplicate = window.SIAKAD.readStudents().some(item => item.nis === formData.nis && Number(item.id) !== Number(id));
    if (duplicate) { showError('nis', 'NIS sudah digunakan oleh siswa lain.'); valid = false; }
    if (!valid) return;
    window.SIAKAD.saveStudent(formData);
    window.location.href = 'data-master.html?saved=1';
  });

  document.querySelectorAll('[data-cancel-form]').forEach(el => el.addEventListener('click', event => { event.preventDefault(); window.location.href = 'data-master.html'; }));
  function showError(field, message) { const input = document.getElementById(field); input.classList.add('input-invalid'); const error = document.querySelector(`[data-error-for="${field}"]`); if (error) error.textContent = message; }
  function clearErrors() { form.querySelectorAll('.input-invalid').forEach(el => el.classList.remove('input-invalid')); form.querySelectorAll('[data-error-for]').forEach(el => { el.textContent = ''; }); }
});
