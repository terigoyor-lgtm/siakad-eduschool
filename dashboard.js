document.addEventListener('DOMContentLoaded', () => {
  const students = window.SIAKAD?.readStudents() || [];
  const active = students.filter(s => s.status === 'Aktif').length;
  const girls = students.filter(s => s.gender === 'Perempuan').length;
  const boys = students.filter(s => s.gender === 'Laki-laki').length;
  document.getElementById('totalStudents').textContent = students.length;
  document.getElementById('activeStudents').textContent = active;
  document.getElementById('totalTeachers').textContent = window.SIAKAD?.teachers.length || 0;
  document.getElementById('totalClasses').textContent = window.SIAKAD?.classes.length || 0;

  const latest = students.slice(0, 5);
  const tbody = document.getElementById('recentStudents');
  tbody.innerHTML = latest.length ? latest.map(student => `
    <tr><td><div class="person-cell"><span class="avatar avatar-${student.gender === 'Perempuan' ? 'pink' : 'blue'}">${escapeHTML(student.name).split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase()}</span><div><strong>${escapeHTML(student.name)}</strong><small>${escapeHTML(student.nis)}</small></div></div></td>
    <td>${escapeHTML(student.className)}</td><td><span class="status status-${student.status === 'Aktif' ? 'active' : 'inactive'}">${escapeHTML(student.status)}</span></td><td><strong>${Number(student.average || 0)}</strong></td></tr>`).join('') : '<tr><td colspan="4" class="empty-cell">Belum ada data siswa.</td></tr>';

  const chartCanvas = document.getElementById('studentChart');
  if (chartCanvas && window.Chart) {
    const classCounts = window.SIAKAD.classes.map(className => students.filter(s => s.className === className).length);
    new Chart(chartCanvas, {
      type: 'bar',
      data: { labels: window.SIAKAD.classes, datasets: [{ label: 'Jumlah siswa', data: classCounts, backgroundColor: '#4776d0', borderRadius: 7, maxBarThickness: 28 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: '#edf0f6' } }, x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 6 } } } }
    });
  } else if (chartCanvas) {
    chartCanvas.parentElement.innerHTML = '<p class="muted chart-fallback">Grafik membutuhkan koneksi internet untuk memuat Chart.js. Ringkasan data tetap bisa digunakan.</p>';
  }
  document.getElementById('genderLegend').innerHTML = `<div class="legend-item"><span class="legend-dot dot-blue"></span>Laki-laki <strong>${boys}</strong></div><div class="legend-item"><span class="legend-dot dot-pink"></span>Perempuan <strong>${girls}</strong></div>`;

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }
});
