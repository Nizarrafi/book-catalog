const { Pool } = require("pg"); // Driver database

// Hubungkan ke RDS menggunakan variabel lingkungan (.env)
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 5432,
    ssl: { rejectUnauthorized: false }
});

const Book = {
    // Fungsi mengambil semua data buku, urutkan dari yang terbaru ditambahkan
    getAll: async () => {
        const res = await pool.query("SELECT * FROM books ORDER BY created_at DESC");
        return res.rows;
    },
    // Fungsi mencari 1 buku berdasarkan ID-nya
    getById: async (id) => {
        const res = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
        return res.rows[0];
    },
    // Fungsi menambah baris buku baru ke RDS
    create: async (title, author, year, imageUrl) => {
        const res = await pool.query(
            "INSERT INTO books (title, author, year, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
            [title, author, year, imageUrl]
        );
        return res.rows[0];
    },
    // Fungsi mengubah data buku yang sudah ada (RDS Update)
    update: async (id, title, author, year, imageUrl) => {
        const res = await pool.query(
            "UPDATE books SET title = $1, author = $2, year = $3, image_url = $4 WHERE id = $5 RETURNING *",
            [title, author, year, imageUrl, id]
        );
        return res.rows[0];
    },
    // Fungsi menghapus buku dari RDS permanen
    delete: async (id) => {
        await pool.query("DELETE FROM books WHERE id = $1", [id]);
    }
};

module.exports = Book;
