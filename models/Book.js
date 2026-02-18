const pool = require("../config/db");

const Book = {
    getAll: async () => {
        const res = await pool.query("SELECT * FROM books ORDER BY created_at DESC");
        return res.rows;
    },
    getById: async (id) => {
        const res = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
        return res.rows[0];
    },
    create: async (title, author, year, imageUrl) => {
        const res = await pool.query(
            "INSERT INTO books (title, author, year, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
            [title, author, year, imageUrl]
        );
        return res.rows[0];
    },
    update: async (id, title, author, year, imageUrl) => {
        const res = await pool.query(
            "UPDATE books SET title = $1, author = $2, year = $3, image_url = $4 WHERE id = $5 RETURNING *",
            [title, author, year, imageUrl, id]
        );
        return res.rows[0];
    },
    delete: async (id) => {
        await pool.query("DELETE FROM books WHERE id = $1", [id]);
    }
};

module.exports = Book;
