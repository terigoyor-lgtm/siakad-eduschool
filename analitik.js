

document.addEventListener("DOMContentLoaded", function () {
  // Ambil data dari sumber resmi aplikasi SIAKAD.
  const siswa = window.SIAKAD
    ? window.SIAKAD.readStudents()
    : [];

  const aktif = siswa.filter(
    s => String(s.status || "").toLowerCase() === "aktif"
  );

  const nilai = siswa
    .map(s => Number(s.average))
    .filter(n => Number.isFinite(n) && n >= 0 && n <= 100);

  document.getElementById("totalSiswa").textContent = siswa.length;
  document.getElementById("siswaAktif").textContent = aktif.length;

  document.getElementById("rataNilai").textContent = nilai.length
    ? (nilai.reduce((total, n) => total + n, 0) / nilai.length).toFixed(1)
    : "—";

  // Rekap jumlah siswa per kelas.
  const kelasMap = {};

  siswa.forEach(s => {
    const kelas = s.className || "Belum ditentukan";
    kelasMap[kelas] = (kelasMap[kelas] || 0) + 1;
  });

  const rekapKelas = document.getElementById("rekapKelas");
  rekapKelas.replaceChildren();

  if (siswa.length === 0) {
    rekapKelas.textContent = "Belum ada data siswa.";
  } else {
    const jumlahMaks = Math.max(1, ...Object.values(kelasMap));

    Object.entries(kelasMap)
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .forEach(([kelas, jumlah]) =>  {
      const baris = document.createElement("div");

      const label = document.createElement("div");
      label.style.cssText =
        "display:flex;justify-content:space-between;margin-bottom:6px";

      const nama = document.createElement("span");
      nama.textContent = kelas;

      const angka = document.createElement("strong");
      angka.textContent = jumlah + " siswa";

      label.append(nama, angka);

      const jalur = document.createElement("div");
      jalur.style.cssText =
        "height:10px;background:#e8edf5;border-radius:8px;overflow:hidden";

      const batang = document.createElement("div");
      batang.style.cssText =
        "height:100%;background:#315fbd;border-radius:8px";
      batang.style.width = (jumlah / jumlahMaks * 100) + "%";

      jalur.append(batang);
      baris.append(label, jalur);
      rekapKelas.append(baris);
    });
  }

  // Rekap status siswa.
  const nonaktif = siswa.length - aktif.length;
  document.getElementById("rekapStatus").textContent =
    `Aktif: ${aktif.length} siswa | Nonaktif: ${nonaktif} siswa`;
});

