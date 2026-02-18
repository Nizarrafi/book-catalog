# MyLibrary - Sistem Manajemen Buku Sederhana 📚

Proyek ini adalah aplikasi web sederhana untuk mengelola koleksi buku favorit, dibangun dengan **Node.js**, **Express**, dan **PostgreSQL**.

## Fitur Utama:
- **Login/Register**: Sistem masuk user yang simpel (Session-based).
- **Katalog Buku**: Menampilkan daftar koleksi buku.
- **Kelola Buku**: Tambah dan Hapus data buku dari database.

---

## 🚀 Tutorial Push ke GitHub

Jika kamu ingin meng-upload kode ini ke repository GitHub baru:

1. **Login ke GitHub** dan buat repository baru bernama `mini-ecommerce` (atau nama lain).
2. **Buka Terminal** di folder ini dan jalankan:
   ```bash
   git add .
   git commit -m "Pivot ke Sistem Manajemen Buku"
   git branch -M main
   git remote add origin https://github.com/USERNAME_KAMU/NAMA_REPO.git
   git push -u origin main
   ```
   *Ganti `USERNAME_KAMU` dan `NAMA_REPO` dengan milikmu.*

---

## ☁️ Deploy ke AWS CloudFormation

1. **Buka AWS Console** dan masuk ke layanan **CloudFormation**.
2. **Create Stack** (With new resources):
   - Upload template file: Pilih `cek1.yaml` dari folder ini.
3. **Isi Parameter**:
   - `KeyName`: Pilih KeyPair EC2 kamu.
   - `DBPassword`: Buat password untuk database kamu (minimal 8 karakter).
   - *(Tidak ada lagi input JWT Secret karena sudah otomatis!)*
## 💡 Panduan Tanya Jawab (Persiapan Presentasi)

Berikut adalah beberapa pertanyaan yang mungkin ditanyakan oleh penguji dan cara menjawabnya:

1.  **T: Kenapa menggunakan Session dibanding JWT?**
    - **J:** "Saya memilih **Session** karena lebih simpel dan aman untuk aplikasi skala kecil. Datanya disimpan di memori server, sehingga kita tidak perlu repot mengelola token di sisi client. Ini juga lebih efisien karena tidak perlu mengirim token besar di setiap request."
2.  **T: Apa fungsi S3 di aplikasi ini?**
    - **J:** "S3 digunakan sebagai **Object Storage** untuk menyimpan file gambar (cover buku). Keuntungannya adalah beban server EC2 jadi lebih ringan karena tidak perlu menyimpan file di harddisk lokal, dan gambar bisa diakses lebih cepat secara publik."
3.  **T: Apa fungsi RDS di sini?**
    - **J:** "RDS adalah database terpisah. Jika server EC2 kita rusak atau di-restart, data buku dan user tetap aman karena database-nya berdiri sendiri (Managed Service)."
4.  **T: Kenapa ada `secret` di konfigurasi Session?**
    - **J:** "Itu adalah kunci rahasia milik server untuk menandatangani sesssion cookie. Gunanya agar user tidak bisa memalsukan ID mereka sendiri atau membajak session orang lain."
5.  **T: Bagaimana cara aplikasi ini terhubung ke AWS saat dideploy?**
    - **J:** "Melalui file CloudFormation (`cek1.yaml`), CloudFormation otomatis membuat AWS Resources (EC2, S3, RDS) dan menghubungkannya melalui variabel lingkungan (Environment Variables) yang ditulis ke file `.env` saat instalasi."

---
*Dibuat oleh AI Helper untuk Nizar Rafi - Semoga Sukses Presentasinya!* 📚🚀
4. **Tunggu stack selesai** (CREATE_COMPLETE).
5. **Cek tab Outputs**: Klik link `PublicURL` untuk membuka aplikasi kamu.

---

Semangat! Semuanya sudah siap tempur! ✨
