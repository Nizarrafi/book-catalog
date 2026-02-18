const express = require("express"); // Import framework Express untuk membuat server web
const cors = require("cors"); // Import CORS agar server bisa diakses dari domain berbeda (jika perlu)
const session = require("express-session"); // Import middleware Session untuk menyimpan data login user di server
require("dotenv").config(); // Load variabel dari file .env (seperti DB_HOST, dll) ke memory

const app = express(); // Inisialisasi aplikasi Express

// --- Middleware Global ---

app.use(cors()); // Mengaktifkan CORS
app.use(express.json()); // Agar server bisa membaca data berformat JSON dari request
app.use(express.urlencoded({ extended: true })); // Agar server bisa membaca data dari form (HTML Form)

// Konfigurasi Session (Pengganti JWT)
app.use(session({
  // 'secret' adalah kunci tanda tangan cookie. Sifatnya internal, tidak perlu diganti-ganti.
  // Gunanya agar user tidak bisa memalsukan ID session mereka sendiri.
  secret: "my-library-secret-key-don-t-change",
  resave: false, // Jangan simpan ulang session jika tidak ada perubahan data
  saveUninitialized: false, // Jangan simpan session kosong untuk pengunjung yang belum login
  cookie: { secure: false } // Set ke 'true' hanya jika menggunakan HTTPS (SSL)
}));

app.use(express.static("public")); // Memberitahu Express lokasi file statis (CSS, Gambar lokal, dll)

app.set("view engine", "ejs"); // Menggunakan EJS sebagai mesin template (untuk menampilkan HTML dinamis)

// --- Routing (Pengaturan Alamat URL) ---

app.use("/auth", require("./routes/auth")); // Semua URL yang diawali /auth akan diurus oleh file routes/auth.js
app.use("/books", require("./routes/product")); // Semua URL /books akan diurus oleh routes/product.js

// Route Utama: Langsung diarahkan ke daftar buku
app.get("/", (req, res) => {
  res.redirect("/books");
});

// Health Check: Digunakan oleh AWS Load Balancer untuk memastikan server masih hidup
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// 404 Handler: Jika user mengakses alamat yang tidak ada
app.use((req, res) => {
  res.status(404).render("404", { url: req.originalUrl });
});

// --- Jalankan Server ---

const createTables = require("./models/init"); // Import fungsi untuk membuat tabel database otomatis

const PORT = process.env.PORT || 3000; // Gunakan port dari AWS (biasanya 3000) atau 3000 jika dijalankan lokal

// Pertama: Pastikan tabel di database DB RDS sudah siap
createTables().then(() => {
  // Kedua: Baru jalankan server untuk menerima pengunjung
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});