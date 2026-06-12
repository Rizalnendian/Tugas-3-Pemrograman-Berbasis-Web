
function showAlert(pesan, tipe) {
  const alertEl = document.getElementById('login-alert');
  if (!alertEl) return;

  const warna = {
    success : { bg: '#f0fdf4', border: '#86efac', text: '#166534', icon: '✅' },
    error   : { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b', icon: '❌' },
    warning : { bg: '#fffbeb', border: '#fcd34d', text: '#92400e', icon: '⚠️' },
    info    : { bg: '#eff6ff', border: '#93c5fd', text: '#1e40af', icon: 'ℹ️' }
  };

  const gaya = warna[tipe] || warna.info;

  alertEl.style.display = 'block';
  alertEl.style.cssText = `
    display: block;
    padding: 12px 16px;
    margin-bottom: 16px;
    background: ${gaya.bg};
    border: 1px solid ${gaya.border};
    border-radius: 10px;
    color: ${gaya.text};
    font-size: 14px;
    font-weight: 500;
  `;
  alertEl.innerHTML = `${gaya.icon} &nbsp;${pesan}`;

  // Sembunyikan otomatis setelah 5 detik
  clearTimeout(alertEl._timer);
  alertEl._timer = setTimeout(() => {
    alertEl.style.display = 'none';
  }, 5000);
}


function openModal(idModal) {
  const el = document.getElementById(idModal);
  if (el) el.classList.add('active');
}

function closeModal(idModal) {
  const el = document.getElementById(idModal);
  if (el) el.classList.remove('active');
}


document.addEventListener('DOMContentLoaded', function () {


  const togglePw  = document.getElementById('toggle-pw');
  const inputPw   = document.getElementById('pw');

  if (togglePw && inputPw) {
    togglePw.addEventListener('click', function () {
      const sedangPassword = inputPw.type === 'password';
      inputPw.type         = sedangPassword ? 'text' : 'password';
      togglePw.textContent = sedangPassword ? '🙈' : '👁️';
    });
  }


  const btnLupa = document.getElementById('btn-lupa');
  if (btnLupa) {
    btnLupa.addEventListener('click', function () {
      openModal('modal-lupa');
    });
  }


  const btnDaftar = document.getElementById('btn-daftar');
  if (btnDaftar) {
    btnDaftar.addEventListener('click', function () {
      openModal('modal-daftar');
    });
  }


  document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function (e) {

      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });


  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const emailInput = document.getElementById('email').value.trim().toLowerCase();
      const pwInput    = document.getElementById('pw').value.trim();


      if (!emailInput || !pwInput) {
        showAlert('Email dan password wajib diisi!', 'error');
        return;
      }


      const daftarUser = typeof dataUsers !== 'undefined' ? dataUsers
                       : typeof dataPengguna !== 'undefined' ? dataPengguna
                       : [];

      if (daftarUser.length === 0) {
        showAlert('Data pengguna tidak dapat dimuat. Hubungi administrator.', 'error');
        return;
      }


      const userDitemukan = daftarUser.find(function (u) {
        return u.email.toLowerCase() === emailInput && u.password === pwInput;
      });

      if (userDitemukan) {

        sessionStorage.setItem('sitta_user', JSON.stringify({
          id    : userDitemukan.id,
          nama  : userDitemukan.nama,
          email : userDitemukan.email,
          role  : userDitemukan.role,
          lokasi: userDitemukan.lokasi || 'Pusat'
        }));

        showAlert(`Login berhasil! Selamat datang, ${userDitemukan.nama}. Mengalihkan...`, 'success');


        setTimeout(function () {
          window.location.href = 'dashboard.html';
        }, 1200);

      } else {
        showAlert('Email atau password salah. Silakan coba lagi.', 'error');
        document.getElementById('pw').value = '';
        document.getElementById('pw').focus();
      }
    });
  }
});