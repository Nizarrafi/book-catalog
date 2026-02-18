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
4. **Tunggu stack selesai** (CREATE_COMPLETE).
5. **Cek tab Outputs**: Klik link `PublicURL` untuk membuka aplikasi kamu.

---

## 🛠️ Cara Menjelaskan Saat Sidang/Presentasi

Jika ditanya kenapa strukturnya seperti ini:
- **"Kenapa pakai Session bukan JWT?"**: *"Karena aplikasi ini bersifat monolitik (Server-side rendering), Session lebih simpel dikelola dan cenderung lebih aman untuk aplikasi kecil karena data disimpan di server, bukan di browser user."*
- **"Apa fungsi cek1.yaml?"**: *"Itu adalah Infrastructure as Code (IaC). Kita pakai CloudFormation untuk membangun server VPC, EC2, RDS (Database), dan S3 secara otomatis dan konsisten."*

Semangat! Semuanya sudah siap tempur! ✨
