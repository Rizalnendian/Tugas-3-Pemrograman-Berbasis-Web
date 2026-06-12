new Vue({
  el: '#appTracking',
  data: {
    clock: '00:00:00',
    searchNoDO: '',
    isSearched: false,
    currentTrackData: null,
    sessionUser: { nama: 'Admin UTDAERAH', role: 'Administrator' },

    trackingList: typeof dataTracking !== 'undefined' ? dataTracking : [],
    paketSource:  typeof paketList   !== 'undefined' ? paketList   : [],
    selectedPaketCode: '',

    daftarDO: typeof dataTracking !== 'undefined' ? dataTracking : [],

    newDO: {
      nim: '',
      namaMahasiswa: '',
      ekspedisi: 'JNE',
      tujuan: 'Jakarta'
    },

    alertVisible: false,
    alertMessage: '',
    alertType:    'info',
    alertTimer:   null,

    confirmVisible:  false,
    confirmMessage:  '',
    confirmCallback: null
  },

  // IMPLEMENTASI FILTER
  filters: {
    formatRupiah(angka) {
      if (!angka && angka !== 0) return 'Rp 0';
      return 'Rp ' + Number(angka).toLocaleString('id-ID');
    },
    formatTanggalFilter(str) {
      if (!str) return '–';
      return new Date(str).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric'
      });
    }
  },

  watch: {
    searchNoDO(newValue) {
      if (!newValue || newValue.trim() === '') {
        this.currentTrackData = null;
        this.isSearched = false;
      }
    }
  },

  computed: {
    userInitial() {
      return this.sessionUser.nama.charAt(0).toUpperCase();
    },
    nextGeneratedNoDO() {
      const count = this.trackingList.length + 1;
      return `DO2026-${String(count).padStart(4, '0')}`;
    },
    selectedPaketDetail() {
      return this.paketSource.find(p => p.kode === this.selectedPaketCode) || null;
    },
    hargaTerpilih() {
      return this.selectedPaketDetail ? this.selectedPaketDetail.harga : 0;
    },
    alertIcon() {
      const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
      return icons[this.alertType] || 'ℹ️';
    },
    alertStyle() {
      const map = {
        success: 'background:#f0fdf4;border:1px solid #86efac;color:#166534;',
        error:   'background:#fef2f2;border:1px solid #fca5a5;color:#991b1b;',
        warning: 'background:#fffbeb;border:1px solid #fcd34d;color:#92400e;',
        info:    'background:#eff6ff;border:1px solid #93c5fd;color:#1e40af;'
      };
      return map[this.alertType] || map.info;
    }
  },

  methods: {
    startClock() {
      setInterval(() => {
        this.clock = new Date().toLocaleTimeString('id-ID');
      }, 1000);
    },
    showAlert(pesan, tipe) {
      this.alertMessage = pesan;
      this.alertType    = tipe || 'info';
      this.alertVisible = true;
      if (this.alertTimer) clearTimeout(this.alertTimer);
      this.alertTimer = setTimeout(() => { this.alertVisible = false; }, 5000);
    },
    showConfirm(pesan, callback) {
      this.confirmMessage  = pesan;
      this.confirmCallback = callback;
      this.confirmVisible  = true;
    },
    confirmYa() {
      this.confirmVisible = false;
      if (typeof this.confirmCallback === 'function') this.confirmCallback();
      this.confirmCallback = null;
    },
    confirmTidak() {
      this.confirmVisible  = false;
      this.confirmCallback = null;
    },
    searchTracking() {
      if (!this.searchNoDO || this.searchNoDO.trim() === '') {
        this.showAlert('Masukkan Nomor DO terlebih dahulu!', 'warning');
        return;
      }
      const found = this.trackingList.find(
        t => t.noDO.toUpperCase() === this.searchNoDO.trim().toUpperCase()
      );
      if (found) {
        this.currentTrackData = found;
        this.isSearched = true;
      } else {
        this.currentTrackData = null;
        this.isSearched = true;
        this.showAlert('Nomor DO tidak ditemukan di dalam sistem SITTA!', 'error');
      }
    },
    tambahDO() {
      if (!this.newDO.nim || this.newDO.nim.trim().length < 9) {
        this.showAlert('Format NIM tidak valid! Isi secara benar (minimal 9 digit).', 'error');
        return;
      }
      if (!this.newDO.namaMahasiswa || this.newDO.namaMahasiswa.trim() === '') {
        this.showAlert('Nama Mahasiswa wajib diisi!', 'error');
        return;
      }
      if (!this.selectedPaketCode) {
        this.showAlert('Silakan pilih paket semester bahan ajar terlebih dahulu!', 'warning');
        return;
      }

      const p       = this.selectedPaketDetail;
      const today   = new Date().toISOString().split('T')[0];
      const noDO    = this.nextGeneratedNoDO;

      const newOrder = {
        noDO,
        namaMahasiswa: this.newDO.namaMahasiswa,
        nim:           this.newDO.nim,
        asal:          'UT Pusat – Tangerang Selatan',
        tujuan:        this.newDO.tujuan,
        status:        'Pending',
        ekspedisi:     this.newDO.ekspedisi,
        tanggalKirim:  today,
        jenisPaket:    p.kode + ' - ' + p.nama,
        totalPembayaran: p.harga,
        perjalanan: [
          {
            waktu: today + ' 09:00:00',
            keterangan: `Delivery Order dibuat. Isi Paket: [${p.isi.join(', ')}]. Menunggu Kurir.`
          }
        ]
      };

      this.trackingList.push(newOrder);
      this.daftarDO = [...this.trackingList];   

      if (typeof dataHistori !== 'undefined') {
        dataHistori.unshift({
          tanggal:  today,
          noDO,
          utDaerah: 'UPBJJ ' + newOrder.tujuan,
          barang:   p.nama,
          jumlah:   p.isi.length,
          nilai:    p.harga,
          status:   'Pending'
        });
      }

      if (typeof dataMonitoringDO !== 'undefined') {
        dataMonitoringDO.unshift({
          noDO,
          utDaerah:   'UPBJJ ' + newOrder.tujuan,
          jumlahItem: p.isi.length,
          tanggalDO:  today,
          persentase: 0,
          status:     'Pending'
        });
      }

      this.searchNoDO       = noDO;
      this.currentTrackData = newOrder;
      this.isSearched       = true;

      this.newDO.nim           = '';
      this.newDO.namaMahasiswa = '';
      this.selectedPaketCode   = '';

      this.showAlert(`Delivery Order ${noDO} sukses diterbitkan!`, 'success');
    },
    badgeClass(status) {
      const map = {
        'Selesai':          'badge-success',
        'Terkirim':         'badge-success',
        'Dalam Perjalanan': 'badge-info',
        'Diproses':         'badge-warning',
        'Pending':          'badge-danger'
      };
      return map[status] || 'badge-warning';
    },
    handleLogout() {
      this.showConfirm(
        'Apakah Anda yakin ingin keluar dari sistem SITTA?',
        () => {
          sessionStorage.removeItem('sitta_user');
          window.location.href = 'index.html';
        }
      );
    }
  },
  mounted() {
    this.startClock();
    this.daftarDO = this.trackingList;

    const user = JSON.parse(sessionStorage.getItem('sitta_user') || 'null');
    if (user) {
      this.sessionUser = user;
    }
  }
});