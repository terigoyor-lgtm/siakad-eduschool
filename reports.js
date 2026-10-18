document.addEventListener('DOMContentLoaded', () => {
  const classFilter = document.getElementById('reportClass');
  const statusFilter = document.getElementById('reportStatus');
  const tbody = document.getElementById('reportRows');
  window.SIAKAD.classes.forEach(name => { const option = document.createElement('option'); option.value = name; option.textContent = name; classFilter.appendChild(option); });

  function esc(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
  function render() {
    const rows = window.SIAKAD.readStudents().filter(s => (!classFilter.value || s.className === classFilter.value) && (!statusFilter.value || s.status === statusFilter.value));
    const average = rows.length ? rows.reduce((sum, row) => sum + Number(row.average || 0), 0) / rows.length : 0;
    document.getElementById('reportTotal').textContent = rows.length;
    document.getElementById('reportActive').textContent = rows.filter(s => s.status === 'Aktif').length;
    document.getElementById('reportAverage').textContent = average.toFixed(1);
    document.getElementById('reportRows').innerHTML = rows.length ? rows.map((s, index) => `<tr><td>${index + 1}</td><td class="mono">${esc(s.nis)}</td><td><strong>${esc(s.name)}</strong></td><td>${esc(s.className)}</td><td>${esc(s.gender)}</td><td><span class="status status-${s.status === 'Aktif' ? 'active' : 'inactive'}">${esc(s.status)}</span></td><td><strong>${Number(s.average || 0)}</strong></td></tr>`).join('') : '<tr><td colspan="7" class="empty-cell">Tidak ada data untuk filter ini.</td></tr>';
  }
  classFilter.addEventListener('change', render); statusFilter.addEventListener('change', render);
  document.getElementById('printReport').addEventListener('click', () => window.print());
  document.getElementById('exportCsv').addEventListener('click', () => {
    const rows = window.SIAKAD.readStudents().filter(s => (!classFilter.value || s.className === classFilter.value) && (!statusFilter.value || s.status === statusFilter.value));
    const headings = ['NIS', 'Nama', 'Jenis Kelamin', 'Kelas', 'Email', 'Telepon', 'Status', 'Nilai Rata-rata'];
    const csvCell = value => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const content = '\uFEFF' + [headings, ...rows.map(s => [s.nis, s.name, s.gender, s.className, s.email, s.phone, s.status, s.average])].map(row => row.map(csvCell).join(',')).join('\r\n');
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a');
    link.href = url; link.download = 'laporan-siakad-siswa.csv'; link.click(); URL.revokeObjectURL(url);
  });
  render();
});
