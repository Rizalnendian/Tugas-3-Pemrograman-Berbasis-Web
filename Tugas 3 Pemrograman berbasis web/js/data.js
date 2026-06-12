
var upbjjList = ['Jakarta', 'Surabaya', 'Makassar', 'Padang', 'Denpasar'];

var kategoriList = ['MK Wajib', 'MK Pilihan', 'Praktikum', 'Problem-Based'];

var pengirimanList = [
  { kode: 'REG', nama: 'Reguler (3–5 hari)' },
  { kode: 'EXP', nama: 'Ekspres (1–2 hari)' }
];


var paketList = [
  {
    kode:  'PAKET-UT-001',
    nama:  'PAKET IPS Dasar',
    isi:   ['EKMA4116', 'EKMA4115'],
    harga: 120000
  },
  {
    kode:  'PAKET-UT-002',
    nama:  'PAKET IPA Dasar',
    isi:   ['BIOL4201', 'FISIP4001'],
    harga: 140000
  }
];


var dataBahanAjar = [
  {
    kode:        'EKMA4116',
    judul:       'Pengantar Manajemen',
    kategori:    'MK Wajib',
    upbjj:       'Jakarta',
    lokasiRak:   'R1-A3',
    harga:       65000,
    qty:         28,
    safety:      20,
    catatanHTML: '<em>Edisi 2024, cetak ulang</em>'
  },
  {
    kode:        'EKMA4115',
    judul:       'Pengantar Akuntansi',
    kategori:    'MK Wajib',
    upbjj:       'Jakarta',
    lokasiRak:   'R1-A4',
    harga:       60000,
    qty:         7,
    safety:      15,
    catatanHTML: '<strong>Cover baru</strong>'
  },
  {
    kode:        'BIOL4201',
    judul:       'Biologi Umum (Praktikum)',
    kategori:    'Praktikum',
    upbjj:       'Surabaya',
    lokasiRak:   'R3-B2',
    harga:       80000,
    qty:         12,
    safety:      10,
    catatanHTML: 'Butuh <u>pendingin</u> untuk kit basah'
  },
  {
    kode:        'FISIP4001',
    judul:       'Dasar-Dasar Sosiologi',
    kategori:    'MK Pilihan',
    upbjj:       'Makassar',
    lokasiRak:   'R2-C1',
    harga:       55000,
    qty:         2,
    safety:      8,
    catatanHTML: 'Stok <i>menipis</i>, prioritaskan reorder'
  }
];


var dataTracking = [
  {
    noDO:             'DO2026-0001',
    namaMahasiswa:    'Rina Wulandari',
    nim:              '123456789',
    asal:             'UT Pusat – Tangerang Selatan',
    tujuan:           'Jakarta',
    status:           'Dalam Perjalanan',
    ekspedisi:        'JNE',
    tanggalKirim:     '2026-05-10',
    jenisPaket:       'PAKET-UT-001 - PAKET IPS Dasar',
    totalPembayaran:  120000,
    perjalanan: [
      { waktu: '2026-05-10 09:00:00', keterangan: 'Penerimaan di Loket: TANGSEL' },
      { waktu: '2026-05-12 11:15:00', keterangan: 'Tiba di Hub: JAKARTA' }
    ]
  },
  {
    noDO:             'DO2026-0002',
    namaMahasiswa:    'Agus Pranoto',
    nim:              '987654321',
    asal:             'UT Pusat – Tangerang Selatan',
    tujuan:           'Makassar',
    status:           'Terkirim',
    ekspedisi:        'JNE',
    tanggalKirim:     '2026-05-08',
    jenisPaket:       'PAKET-UT-002 - PAKET IPA Dasar',
    totalPembayaran:  140000,
    perjalanan: [
      { waktu: '2026-05-08 09:00:00', keterangan: 'Penerimaan di Loket: TANGSEL' },
      { waktu: '2026-05-09 14:00:00', keterangan: 'Tiba di Hub: MAKASSAR' },
      { waktu: '2026-05-11 17:30:00', keterangan: 'Selesai Antar. Penerima: Agus Pranoto' }
    ]
  }
];


var dataUsers = [
  { id: 1, nama: 'Rina Wulandari', email: 'rina@ut.ac.id',  password: 'rina123',  role: 'UPBJJ-UT',       lokasi: 'Jakarta' },
  { id: 2, nama: 'Agus Pranoto',   email: 'agus@ut.ac.id',  password: 'agus123',  role: 'UPBJJ-UT',       lokasi: 'Makassar' },
  { id: 5, nama: 'Admin SITTA',    email: 'admin@ut.ac.id', password: 'admin123', role: 'Administrator',  lokasi: 'Pusat' }
];

var dataPengguna = dataUsers;


var dataHistori = [
  { tanggal: '2026-05-10', noDO: 'DO2026-0001', utDaerah: 'Jakarta',  barang: 'PAKET IPS Dasar', jumlah: 2, nilai: 120000, status: 'Dalam Perjalanan' },
  { tanggal: '2026-05-08', noDO: 'DO2026-0002', utDaerah: 'Makassar', barang: 'PAKET IPA Dasar', jumlah: 2, nilai: 140000, status: 'Terkirim' }
];


var dataMonitoringDO = [
  { noDO: 'DO2026-0001', utDaerah: 'Jakarta',  jumlahItem: 2, tanggalDO: '2026-05-10', persentase: 65,  status: 'Dalam Perjalanan' },
  { noDO: 'DO2026-0002', utDaerah: 'Makassar', jumlahItem: 2, tanggalDO: '2026-05-08', persentase: 100, status: 'Terkirim' }
];


var dataRekap = [
  { bulan: 'Mei 2026', totalDO: 2, totalItem: 4, totalNilai: 260000, terkirim: 1 }
];