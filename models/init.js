const { Pool } = require("pg"); // Import driver PostgreSQL untuk Node.js

// Konfigurasi koneksi ke Database RDS (diambil dari file .env)
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 5432, // Port standar PostgreSQL
  ssl: { rejectUnauthorized: false } // Diperlukan agar bisa terkoneksi aman ke AWS RDS
});

// Fungsi untuk membuat tabel secara otomatis jika belum ada (Auto-Migration)
const createTables = async () => {
  // Query untuk membuat tabel user (untuk login)
  const userTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Query untuk membuat tabel buku (untuk katalog)
  const bookTable = `
    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      author VARCHAR(100) NOT NULL,
      year INTEGER,
      image_url TEXT, -- Menyimpan link gambar yang ada di Amazon S3
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    // Jalankan perintah pembuatan tabel ke database RDS
    await pool.query(userTable);
    await pool.query(bookTable);
    console.log("Database & Tables Ready!");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
};

module.exports = createTables;
