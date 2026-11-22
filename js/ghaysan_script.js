document.addEventListener("DOMContentLoaded", function () {
  // 1. Toggle menu navigasi di layar mobile
  const tombolMenu = document.getElementById("ghaysan_toggle_menu");
  const daftarMenu = document.querySelector(".ghaysan_menu");

  if (tombolMenu && daftarMenu) {
    tombolMenu.addEventListener("click", function () {
      daftarMenu.classList.toggle("ghaysan_menu_buka");
    });
  }

  // 2. Filter kategori & counter pada halaman portofolio.html
  const tombolFilter = document.querySelectorAll(".ghaysan_filter_btn");
  const itemPorto = document.querySelectorAll(".ghaysan_porto_item");
  const counterPorto = document.getElementById("ghaysan_porto_counter");

  if (tombolFilter.length > 0 && itemPorto.length > 0) {
    tombolFilter.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const kategoriDipilih = btn.getAttribute("data-kategori");
        let jumlahTampil = 0;

        tombolFilter.forEach(function (b) {
          b.classList.remove("ghaysan_filter_aktif");
        });
        btn.classList.add("ghaysan_filter_aktif");

        itemPorto.forEach(function (item) {
          const kategoriItem = item.getAttribute("data-kategori");
          if (kategoriDipilih === "semua" || kategoriItem === kategoriDipilih) {
            item.style.display = "flex";
            jumlahTampil++;
          } else {
            item.style.display = "none";
          }
        });

        if (counterPorto) {
          counterPorto.textContent =
            "Menampilkan " + jumlahTampil + " dari " + itemPorto.length + " proyek";
        }
      });
    });
  }

  // 3. Modal preview foto & sampel video pada halaman portofolio.html
  const modalPorto = document.getElementById("ghaysan_modal_porto");
  const tombolDetail = document.querySelectorAll(".ghaysan_btn_detail");
  const tombolTutupModal = document.getElementById("ghaysan_modal_tutup");
  const tombolTutupModalBawah = document.getElementById("ghaysan_modal_tutup_bawah");
  const imgModal = document.getElementById("ghaysan_modal_img");
  const videoModal = document.getElementById("ghaysan_modal_video");

  function tutupModalPorto() {
    if (videoModal) {
      videoModal.pause();
      videoModal.currentTime = 0;
      videoModal.removeAttribute("src");
      videoModal.load();
      videoModal.style.display = "none";
    }
    if (modalPorto) {
      modalPorto.classList.remove("ghaysan_modal_buka");
      modalPorto.setAttribute("aria-hidden", "true");
    }
  }

  if (modalPorto && tombolDetail.length > 0) {
    tombolDetail.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const tipe = btn.getAttribute("data-tipe") || "foto";
        const judul = btn.getAttribute("data-judul") || "";
        const poster = btn.getAttribute("data-img") || "";
        const sumberVideo = btn.getAttribute("data-video") || "";

        document.getElementById("ghaysan_modal_judul").textContent = judul;
        document.getElementById("ghaysan_modal_kategori").textContent =
          btn.getAttribute("data-kategori-label") || "";
        document.getElementById("ghaysan_modal_klien").textContent =
          btn.getAttribute("data-klien") || "-";
        document.getElementById("ghaysan_modal_tahun").textContent =
          btn.getAttribute("data-tahun") || "-";
        document.getElementById("ghaysan_modal_hasil").textContent =
          btn.getAttribute("data-hasil") || "-";
        document.getElementById("ghaysan_modal_deskripsi").textContent =
          btn.getAttribute("data-deskripsi") || "";

        if (tipe === "video" && videoModal && imgModal) {
          imgModal.style.display = "none";
          videoModal.style.display = "block";
          videoModal.removeAttribute("poster");
          videoModal.src = sumberVideo;
          videoModal.load();
          videoModal.play().catch(function () {
            // Jika browser memblokir autoplay, kontrol play tetap tersedia
          });
        } else if (imgModal && videoModal) {
          videoModal.pause();
          videoModal.removeAttribute("src");
          videoModal.load();
          videoModal.style.display = "none";
          imgModal.style.display = "block";
          imgModal.src = poster;
          imgModal.alt = judul || "Preview Proyek";
        }

        modalPorto.classList.add("ghaysan_modal_buka");
        modalPorto.setAttribute("aria-hidden", "false");
      });
    });

    if (tombolTutupModal) {
      tombolTutupModal.addEventListener("click", tutupModalPorto);
    }
    if (tombolTutupModalBawah) {
      tombolTutupModalBawah.addEventListener("click", tutupModalPorto);
    }

    modalPorto.addEventListener("click", function (event) {
      if (event.target === modalPorto) {
        tutupModalPorto();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        tutupModalPorto();
      }
    });
  }

  // 4. Sinkronisasi otomatis ?layanan=... atau ?paket=... ke kontak.html
  const paramsUrl = new URLSearchParams(window.location.search);
  const layananParam = paramsUrl.get("layanan");
  const paketParam = paramsUrl.get("paket");
  const selectLayanan = document.getElementById("ghaysan_layanan");
  const textareaPesan = document.getElementById("ghaysan_pesan");

  if (selectLayanan) {
    if (layananParam) {
      const namaLayanan = layananParam.toLowerCase();
      if (namaLayanan.includes("foto")) {
        selectLayanan.value = "Layanan Satuan: Fotografi Komersial";
      } else if (namaLayanan.includes("video")) {
        selectLayanan.value = "Layanan Satuan: Produksi Video & Konten";
      } else if (namaLayanan.includes("web") || namaLayanan.includes("antarmuka")) {
        selectLayanan.value = "Layanan Satuan: Desain Antarmuka & Web";
      }

      if (textareaPesan && textareaPesan.value.trim() === "") {
        textareaPesan.value =
          "Halo Nordik Lens, saya ingin memesan " +
          selectLayanan.value +
          " (non-paket). Mohon info jadwal dan detailnya.";
      }
    } else if (paketParam) {
      const namaPaket = paketParam.toLowerCase();
      if (namaPaket.includes("starter")) {
        selectLayanan.value = "Paket Visual Starter";
      } else if (namaPaket.includes("brand")) {
        selectLayanan.value = "Paket Brand & Web";
      } else if (namaPaket.includes("studio")) {
        selectLayanan.value = "Paket Full Studio";
      }

      if (textareaPesan && textareaPesan.value.trim() === "") {
        textareaPesan.value =
          "Halo Nordik Lens, saya tertarik untuk memesan " +
          selectLayanan.value +
          ". Mohon info jadwal dan langkah selanjutnya.";
      }
    }
  }

  // 5. Validasi & konfirmasi form pada halaman kontak.html
  const formKontak = document.getElementById("ghaysan_form_kontak");
  const statusPesan = document.getElementById("ghaysan_status_pesan");

  if (formKontak && statusPesan) {
    formKontak.addEventListener("submit", function (event) {
      event.preventDefault();

      const nama = document.getElementById("ghaysan_nama").value.trim();
      const email = document.getElementById("ghaysan_email").value.trim();
      const layanan = selectLayanan ? selectLayanan.value : "";
      const pesan = document.getElementById("ghaysan_pesan").value.trim();

      if (nama === "" || email === "" || pesan === "") {
        statusPesan.style.color = "#b42318";
        statusPesan.textContent = "Harap lengkapi nama, email, dan isi pesan terlebih dahulu.";
        return;
      }

      statusPesan.style.color = "#2C2A27";
      statusPesan.textContent =
        "Terima kasih, " + nama + ". Permintaan untuk " + layanan + " telah tercatat (simulasi pengiriman).";
      formKontak.reset();
    });
  }
});