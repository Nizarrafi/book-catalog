const Book = require("../models/Book"); // Import model Book untuk interaksi database
const AWS = require("aws-sdk"); // Import AWS SDK agar bisa mengirim file ke Amazon S3

// Inisialisasi S3 (Konfigurasi diambil otomatis dari IAM Role EC2 saat dideploy ke AWS)
const s3 = new AWS.S3({ region: process.env.AWS_REGION });

const bookController = {
    // Menampilkan semua daftar buku di halaman utama
    getAll: async (req, res) => {
        try {
            const books = await Book.getAll(); // Ambil data buku dari Database RDS
            // Render index.ejs dan kirim data buku serta data user yang sedang login
            res.render("index", { books, user: req.session.userName });
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error");
        }
    },

    // Menampilkan halaman formulir tambah buku
    getAddPage: (req, res) => {
        res.render("add-book");
    },

    // Menampilkan halaman formulir edit buku
    getEditPage: async (req, res) => {
        try {
            const { id } = req.params; // Ambil ID buku dari URL
            const book = await Book.getById(id); // Cari data buku tersebut di database
            if (!book) return res.status(404).send("Book not found");
            res.render("edit-book", { book }); // Render form edit dengan data awal
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error");
        }
    },

    // PROSES TAMBAH BUKU (BARU)
    create: async (req, res) => {
        try {
            const { title, author, year } = req.body;
            let image_url = null;

            // Jika ada file gambar yang diunggah
            if (req.file) {
                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME, // Nama bucket S3 kita
                    Key: `books/${Date.now()}_${req.file.originalname}`, // Nama file unik di S3
                    Body: req.file.buffer, // Isi data file gambarnya
                    ContentType: req.file.mimetype // Jenis file (image/jpeg, dll)
                };
                // Proses upload ke Amazon S3
                const uploadResult = await s3.upload(params).promise();
                // Simpan URL publik hasil upload S3 ke variabel image_url
                image_url = uploadResult.Location;
            }

            // Simpan judul, penulis, tahun, dan link gambar S3 ke Database RDS
            await Book.create(title, author, year, image_url);
            res.redirect("/"); // Selesai, kembali ke halaman utama
        } catch (err) {
            console.error(err);
            res.status(500).send("Error adding book");
        }
    },

    // PROSES UPDATE/EDIT BUKU
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, author, year } = req.body;

            // Cari data buku lama di database (untuk cek gambarnya)
            const existingBook = await Book.getById(id);
            if (!existingBook) return res.status(404).send("Book not found");

            let image_url = existingBook.image_url; // Default gunakan link gambar lama

            // Jika user mengunggah gambar BARU untuk mengganti yang lama
            if (req.file) {
                // 1. Hapus gambar LAMA dari Amazon S3 agar tidak menumpuk
                if (existingBook.image_url) {
                    try {
                        const url = new URL(existingBook.image_url);
                        const key = decodeURIComponent(url.pathname.substring(1)); // Dapatkan nama file S3nya
                        await s3.deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: key }).promise();
                    } catch (e) {
                        console.error("Gagal hapus gambar lama di S3:", e.message);
                    }
                }

                // 2. Upload gambar BARU ke Amazon S3
                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: `books/${Date.now()}_${req.file.originalname}`,
                    Body: req.file.buffer,
                    ContentType: req.file.mimetype
                };
                const uploadResult = await s3.upload(params).promise();
                image_url = uploadResult.Location; // Update link gambar ke yang baru
            }

            // Simpan perubahan ke Database RDS
            await Book.update(id, title, author, year, image_url);
            res.redirect("/");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error updating book");
        }
    },

    // PROSES HAPUS BUKU
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const book = await Book.getById(id);

            // Jika buku punya gambar di S3, hapus dulu gambarnya di cloud S3
            if (book && book.image_url) {
                const url = new URL(book.image_url);
                const key = decodeURIComponent(url.pathname.substring(1));
                await s3.deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: key }).promise();
            }

            // Baru hapus data barisnya di Database RDS
            await Book.delete(id);
            res.redirect("/");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error deleting book");
        }
    },
};

module.exports = bookController;
