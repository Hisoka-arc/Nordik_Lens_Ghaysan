document.addEventListener("DOMContentLoaded", function () {
  // 1. Toggle menu navigasi mobile
  const tombolMenu = document.getElementById("ghaysan_btn_menu");
  const daftarNav = document.getElementById("ghaysan_nav_list");

  if (tombolMenu && daftarNav) {
    tombolMenu.addEventListener("click", function () {
      const sedangBuka = daftarNav.classList.toggle("buka");
      tombolMenu.setAttribute("aria-expanded", sedangBuka ? "true" : "false");
    });

    daftarNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        daftarNav.classList.remove("buka");
        tombolMenu.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 2. Filter kategori portofolio
  const tombolFilter = document.querySelectorAll(".ghaysan_btn_filter");
  const itemPorto = document.querySelectorAll(".ghaysan_porto_item");
  const counterPorto = document.getElementById("ghaysan_porto_counter");

  if (tombolFilter.length > 0 && itemPorto.length > 0) {
    tombolFilter.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const kategoriDipilih = btn.getAttribute("data-kategori") || "semua";

        tombolFilter.forEach(function (b) {
          b.classList.remove("aktif");
        });
        btn.classList.add("aktif");

        let jumlahTampil = 0;
        itemPorto.forEach(function (item) {
          const kategoriItem = item.getAttribute("data-kategori");
          const cocok = kategoriDipilih === "semua" || kategoriItem === kategoriDipilih;
          item.style.display = cocok ? "flex" : "none";
          if (cocok) {
            jumlahTampil += 1;
          }
        });

        if (counterPorto) {
          counterPorto.textContent = "Menampilkan " + jumlahTampil + " dari " + itemPorto.length + " proyek";
        }
      });
    });
  }

  // 3. Modal preview foto & sampel video portofolio (lazy load saat diklik)
  const modalPorto = document.getElementById("ghaysan_modal_porto");
  const modalImg = document.getElementById("ghaysan_modal_img");
  const modalVideo = document.getElementById("ghaysan_modal_video");
  const tombolDetail = document.querySelectorAll(".ghaysan_btn_detail");
  const tombolTutupModal = document.querySelectorAll("[data-tutup-modal]");

  const elJudul = document.getElementById("ghaysan_modal_judul");
  const elDeskripsi = document.getElementById("ghaysan_modal_deskripsi");
  const elKlien = document.getElementById("ghaysan_modal_klien");
  const elTahun = document.getElementById("ghaysan_modal_tahun");
  const elHasil = document.getElementById("ghaysan_modal_hasil");

  function resetMediaModal() {
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.currentTime = 0;
      modalVideo.removeAttribute("src");
      modalVideo.load();
      modalVideo.style.display = "none";
    }
    if (modalImg) {
      modalImg.removeAttribute("src");
      modalImg.alt = "";
      modalImg.style.display = "none";
    }
  }

  function bukaModal(btn) {
    if (!modalPorto) return;

    resetMediaModal();

    const tipe = btn.getAttribute("data-tipe") || "gambar";
    const judul = btn.getAttribute("data-judul") || "Pratinjau Karya";
    const deskripsi = btn.getAttribute("data-deskripsi") || "";
    const klien = btn.getAttribute("data-klien") || "-";
    const tahun = btn.getAttribute("data-tahun") || "-";
    const hasil = btn.getAttribute("data-hasil") || "-";

    if (elJudul) elJudul.textContent = judul;
    if (elDeskripsi) elDeskripsi.textContent = deskripsi;
    if (elKlien) elKlien.textContent = klien;
    if (elTahun) elTahun.textContent = tahun;
    if (elHasil) elHasil.textContent = hasil;

    if (tipe === "video") {
      const srcVideo = btn.getAttribute("data-video") || "";
      if (modalVideo && srcVideo) {
        modalVideo.style.display = "block";
        modalVideo.src = srcVideo;
        modalVideo.load();
        modalVideo.play().catch(function () {});
      }
    } else {
      const srcGambar = btn.getAttribute("data-gambar") || "";
      if (modalImg && srcGambar) {
        modalImg.style.display = "block";
        modalImg.src = srcGambar;
        modalImg.alt = judul;
      }
    }

    modalPorto.classList.add("aktif");
    modalPorto.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function tutupModal() {
    if (!modalPorto) return;
    resetMediaModal();
    modalPorto.classList.remove("aktif");
    modalPorto.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (tombolDetail.length > 0) {
    tombolDetail.forEach(function (btn) {
      btn.addEventListener("click", function () {
        bukaModal(btn);
      });
    });
  }

  if (tombolTutupModal.length > 0) {
    tombolTutupModal.forEach(function (btn) {
      btn.addEventListener("click", tutupModal);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modalPorto && modalPorto.classList.contains("aktif")) {
      tutupModal();
    }
  });

  // 4. Sinkronisasi parameter layanan/paket ke halaman kontak
  const selectLayanan = document.getElementById("ghaysan_pilihan_layanan");
  const textareaPesan = document.getElementById("ghaysan_pesan");

  if (selectLayanan) {
    const params = new URLSearchParams(window.location.search);
    const layananParam = (params.get("layanan") || "").toLowerCase();
    const paketParam = (params.get("paket") || "").toLowerCase();

    let nilaiTerpilih = "";
    let teksAwalPesan = "";

    if (layananParam.includes("foto")) {
      nilaiTerpilih = "Fotografi Komersial";
      teksAwalPesan = "Halo Nordik Lens, saya ingin menanyakan detail layanan Fotografi Komersial.";
    } else if (layananParam.includes("video")) {
      nilaiTerpilih = "Produksi Video & Konten";
      teksAwalPesan = "Halo Nordik Lens, saya ingin menanyakan detail layanan Produksi Video & Konten.";
    } else if (layananParam.includes("web") || layananParam.includes("ui")) {
      nilaiTerpilih = "Desain Antarmuka & Web";
      teksAwalPesan = "Halo Nordik Lens, saya ingin menanyakan detail layanan Desain Antarmuka & Web.";
    } else if (paketParam.includes("starter")) {
      nilaiTerpilih = "Paket Visual Starter";
      teksAwalPesan = "Halo Nordik Lens, saya tertarik dengan Paket Visual Starter.";
    } else if (paketParam.includes("brand")) {
      nilaiTerpilih = "Paket Brand & Web";
      teksAwalPesan = "Halo Nordik Lens, saya tertarik dengan Paket Brand & Web.";
    } else if (paketParam.includes("full") || paketParam.includes("studio")) {
      nilaiTerpilih = "Paket Full Studio";
      teksAwalPesan = "Halo Nordik Lens, saya tertarik dengan Paket Full Studio.";
    }

    if (nilaiTerpilih) {
      const opsiCocok = Array.from(selectLayanan.options).find(function (opt) {
        return opt.value.toLowerCase() === nilaiTerpilih.toLowerCase() || opt.text.toLowerCase() === nilaiTerpilih.toLowerCase();
      });
      if (opsiCocok) {
        selectLayanan.value = opsiCocok.value;
      }
    }

    if (textareaPesan && textareaPesan.value.trim() === "" && teksAwalPesan) {
      textareaPesan.value = teksAwalPesan;
    }
  }

  // 5. Validasi formulir kontak
  const formKontak = document.getElementById("ghaysan_form_kontak");
  const statusPesan = document.getElementById("ghaysan_status_pesan");

  if (formKontak && statusPesan) {
    formKontak.addEventListener("submit", function (event) {
      event.preventDefault();

      const inputNama = document.getElementById("ghaysan_nama");
      const inputEmail = document.getElementById("ghaysan_email");
      const inputPesan = document.getElementById("ghaysan_pesan");

      const nama = inputNama ? inputNama.value.trim() : "";
      const email = inputEmail ? inputEmail.value.trim() : "";
      const pesan = inputPesan ? inputPesan.value.trim() : "";
      const pilihan = selectLayanan ? selectLayanan.value : "Umum";

      if (!nama || !email || !pesan) {
        statusPesan.textContent = "Harap lengkapi nama lengkap, alamat email, dan isi pesan terlebih dahulu.";
        statusPesan.className = "ghaysan_pesan_error";
        return;
      }

      statusPesan.textContent =
        "Terima kasih, " + nama + ". Catatan pesan Anda (" + pilihan + ") telah tercatat pada formulir.";
      statusPesan.className = "ghaysan_pesan_sukses";
      formKontak.reset();
    });
  }
});