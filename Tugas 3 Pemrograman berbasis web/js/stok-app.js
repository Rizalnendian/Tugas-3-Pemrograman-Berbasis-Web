new Vue({
  el: '#appStok',
  data: {
    clock: '00:00:00',
    stokList:     typeof dataBahanAjar !== 'undefined' ? dataBahanAjar : [],
    upbjjList:    typeof upbjjList     !== 'undefined' ? upbjjList     : ['Jakarta','Surabaya','Makassar','Padang','Denpasar'],
    kategoriList: typeof kategoriList  !== 'undefined' ? kategoriList  : ['MK Wajib','MK Pilihan','Praktikum','Problem-Based'],

    filterUpbjj:   '',
    filterKategori:'',
    sortBy:        '',
    filterReorder: false,

    isModalOpen: false,
    newStok: {
      kode:        '',
      judul:       '',
      kategori:    'MK Wajib',
      upbjj:       'Jakarta',
      lokasiRak:   '',
      harga:       0,
      qty:         0,
      safety:      10,
      catatanHTML: ''
    },

    editIndex:    null,
    editItemData: { qty: 0 },

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
    }
  },

  computed: {
    filteredStok() {
      let result = [...this.stokList];
      if (this.filterUpbjj) {
        result = result.filter(item => item.upbjj === this.filterUpbjj);
      }
      if (this.filterKategori) {
        result = result.filter(item => item.kategori === this.filterKategori);
      }
      if (this.filterReorder) {
        result = result.filter(item => item.qty <= item.safety);
      }
      if (this.sortBy) {
        result.sort((a, b) => {
          if (this.sortBy === 'judul')  return a.judul.localeCompare(b.judul);
          if (this.sortBy === 'stock')  return a.qty   - b.qty;
          if (this.sortBy === 'harga')  return a.harga - b.harga;
          return 0;
        });
      }
      return result;
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
  watch: {
    filterUpbjj(newVal) {
      this.filterKategori = '';
      if (!newVal) {
        this.editIndex = null;
      }
    },
    filterReorder(newVal) {
      if (this.editIndex !== null) {
        this.editIndex = null;
      }
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
    resetFilter() {
      this.filterUpbjj    = '';
      this.filterKategori = '';
      this.sortBy         = '';
      this.filterReorder  = false;
    },
    getStokClass(qty) {
      if (qty === 0) return 'badge-danger';
      if (qty <= 10) return 'badge-warning';
      return 'badge-success';
    },
    handleLogout() {
      this.showConfirm(
        'Apakah Anda yakin ingin keluar dari sistem SITTA?',
        () => {
          sessionStorage.removeItem('sitta_user');
          window.location.href = 'index.html';
        }
      );
    },
    openModalTambah()  { this.isModalOpen = true;  },
    closeModalTambah() { this.isModalOpen = false; },
    tambahStok() {
      if (this.newStok.qty < 0 || this.newStok.harga < 0 || this.newStok.safety < 0) {
        this.showAlert('Nilai qty, harga, atau safety stok tidak boleh minus!', 'error');
        return;
      }
      if (!this.newStok.kode || !this.newStok.judul) {
        this.showAlert('Kode MK dan Judul wajib diisi!', 'error');
        return;
      }
      const item = {
        kode:        this.newStok.kode,
        judul:       this.newStok.judul,
        kategori:    this.newStok.kategori,
        upbjj:       this.newStok.upbjj,
        lokasiRak:   this.newStok.lokasiRak,
        harga:       Number(this.newStok.harga),
        qty:         Number(this.newStok.qty),
        safety:      Number(this.newStok.safety),
        catatanHTML: this.newStok.catatanHTML || '–'
      };
      this.stokList.push(item);
      if (typeof dataBahanAjar !== 'undefined' && dataBahanAjar !== this.stokList) {
        dataBahanAjar.push(item);
      }
      this.newStok = {
        kode:        '',
        judul:       '',
        kategori:    'MK Wajib',
        upbjj:       this.filterUpbjj || 'Jakarta',
        lokasiRak:   '',
        harga:       0,
        qty:         0,
        safety:      10,
        catatanHTML: ''
      };
      this.closeModalTambah();
      this.showAlert('Data bahan ajar baru berhasil ditambahkan!', 'success');
    },
    editItem(index) {
      this.editIndex = index;
      this.editItemData.qty = this.filteredStok[index].qty;
    },
    simpanEdit(index) {
      const val = parseInt(this.editItemData.qty);
      if (isNaN(val) || val < 0) {
        this.showAlert('Stok tidak boleh bernilai negatif atau kosong!', 'error');
        return;
      }
      this.filteredStok[index].qty = val;
      this.editIndex = null;
      this.showAlert('Perubahan stok berhasil disimpan.', 'success');
    },
    batalEdit() {
      this.editIndex = null;
    },
    hapusItem(index) {
      this.showConfirm(
        'Apakah Anda yakin ingin menghapus data bahan ajar ini?',
        () => {
          const target      = this.filteredStok[index];
          const actualIndex = this.stokList.indexOf(target);
          if (actualIndex !== -1) {
            this.stokList.splice(actualIndex, 1);
            this.showAlert('Data bahan ajar berhasil dihapus.', 'success');
          }
        }
      );
    }
  },
  mounted() {
    this.startClock();
    const user = JSON.parse(sessionStorage.getItem('sitta_user') || 'null');
    if (user) {
      const nameEl = this.$el.querySelector('.user-name');
      const avEl   = this.$el.querySelector('.user-avatar');
      if (nameEl) nameEl.textContent = user.nama;
      if (avEl)   avEl.textContent   = user.nama.charAt(0).toUpperCase();
    }
  }
});