/* Data contoh untuk simulasi front-end. Tidak terhubung ke database server. */
(function () {
  const STORAGE_KEY = 'siakad_students_v1';
  const sampleStudents = [
    { id: 1, nis: '2026001', name: 'Aditya Pratama', gender: 'Laki-laki', className: 'X IPA 1', email: 'aditya.pratama@contoh.sch.id', phone: '081234567801', status: 'Aktif', average: 88 },
    { id: 2, nis: '2026002', name: 'Siti Nurhaliza', gender: 'Perempuan', className: 'X IPA 1', email: 'siti.nurhaliza@contoh.sch.id', phone: '081234567802', status: 'Aktif', average: 92 },
    { id: 3, nis: '2026003', name: 'Rizky Ramadhan', gender: 'Laki-laki', className: 'X IPS 1', email: 'rizky.ramadhan@contoh.sch.id', phone: '081234567803', status: 'Aktif', average: 79 },
    { id: 4, nis: '2026004', name: 'Putri Maharani', gender: 'Perempuan', className: 'XI IPA 1', email: 'putri.maharani@contoh.sch.id', phone: '081234567804', status: 'Aktif', average: 95 },
    { id: 5, nis: '2026005', name: 'Fajar Nugroho', gender: 'Laki-laki', className: 'XI IPS 1', email: 'fajar.nugroho@contoh.sch.id', phone: '081234567805', status: 'Aktif', average: 83 },
    { id: 6, nis: '2026006', name: 'Nabila Azzahra', gender: 'Perempuan', className: 'XII IPA 1', email: 'nabila.azzahra@contoh.sch.id', phone: '081234567806', status: 'Aktif', average: 91 },
    { id: 7, nis: '2026007', name: 'Dimas Saputra', gender: 'Laki-laki', className: 'XII IPS 1', email: 'dimas.saputra@contoh.sch.id', phone: '081234567807', status: 'Nonaktif', average: 74 },
    { id: 8, nis: '2026008', name: 'Alya Khairunnisa', gender: 'Perempuan', className: 'X IPA 2', email: 'alya.khairunnisa@contoh.sch.id', phone: '081234567808', status: 'Aktif', average: 89 },
    { id: 9, nis: '2026009', name: 'Bima Alfarizi', gender: 'Laki-laki', className: 'X IPS 2', email: 'bima.alfarizi@contoh.sch.id', phone: '081234567809', status: 'Aktif', average: 81 },
    { id: 10, nis: '2026010', name: 'Citra Lestari', gender: 'Perempuan', className: 'XI IPA 2', email: 'citra.lestari@contoh.sch.id', phone: '081234567810', status: 'Aktif', average: 94 }
  ];

  function readStudents() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (error) {
      console.warn('Data lokal tidak dapat dibaca:', error);
    }
    writeStudents(sampleStudents);
    return sampleStudents.map(student => ({ ...student }));
  }

  function writeStudents(students) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }

  function saveStudent(student) {
    const students = readStudents();
    const existingIndex = students.findIndex(item => Number(item.id) === Number(student.id));
    if (existingIndex >= 0) students[existingIndex] = { ...students[existingIndex], ...student };
    else {
      const nextId = students.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
      students.unshift({ ...student, id: nextId });
    }
    writeStudents(students);
    return students;
  }

  function deleteStudent(id) {
    const students = readStudents().filter(student => Number(student.id) !== Number(id));
    writeStudents(students);
    return students;
  }

  window.SIAKAD = {
    STORAGE_KEY,
    readStudents,
    writeStudents,
    saveStudent,
    deleteStudent,
    classes: ['X IPA 1', 'X IPA 2', 'X IPS 1', 'X IPS 2', 'XI IPA 1', 'XI IPA 2', 'XI IPS 1', 'XII IPA 1', 'XII IPS 1'],
    teachers: [
      { name: 'Dra. Ratna Wulandari', subject: 'Matematika', status: 'Aktif' },
      { name: 'Bapak Hendra Saputra, S.Pd.', subject: 'Bahasa Indonesia', status: 'Aktif' },
      { name: 'Ibu Maya Putri, M.Kom.', subject: 'Informatika', status: 'Aktif' },
      { name: 'Bapak Agus Setiawan, S.Pd.', subject: 'Bahasa Inggris', status: 'Aktif' },
      { name: 'Dra. Rini Astuti', subject: 'Biologi', status: 'Aktif' }
    ]
  };
  window.SIAKAD.readStudents();
})();
