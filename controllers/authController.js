const bcrypt = require("bcrypt"); // Library untuk mengacak password (hashing) agar aman
const User = require("../models/User"); // Import model User untuk akses ke tabel database 'users'

const authController = {
    // Menampilkan halaman Login
    getLogin: (req, res) => {
        res.render("login"); // Membuka file views/login.ejs
    },

    // Menampilkan halaman Register
    getRegister: (req, res) => {
        res.render("register"); // Membuka file views/register.ejs
    },

    // Proses Pendaftaran User Baru
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body; // Mengambil data dari form pendaftaran

            // Mengacak password sebanyak 10 putaran (Salt) agar tidak bisa dibaca manusia
            const hashedPassword = await bcrypt.hash(password, 10);

            // Simpan data user ke database RDS
            await User.create(name, email, hashedPassword);

            // Jika berhasil, kirim user ke halaman login
            res.redirect("/auth/login");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error registering user");
        }
    },

    // Proses Login User
    login: async (req, res) => {
        try {
            const { email, password } = req.body; // Ambil email & password yang diketik user
            const user = await User.findByEmail(email); // Cari user berdasarkan email di database

            // Jika email tidak terdaftar
            if (!user) return res.render("login", { error: "User tidak ditemukan" });

            // Bandingkan password yang diketik dengan password teracak (hashed) di database
            const isMatch = await bcrypt.compare(password, user.password);

            // Jika password salah
            if (!isMatch) return res.render("login", { error: "Password salah!" });

            // -- BAGIAN PENTING SESSION --
            // Jika benar, simpan ID dan Nama user ke dalam memori Session di Server.
            // Inilah yang membuat user "tetap login" saat pindah halaman.
            req.session.userId = user.id;
            req.session.userName = user.name;

            // Masuk ke halaman utama
            res.redirect("/");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error logging in");
        }
    },

    // Proses Logout
    logout: (req, res) => {
        // Hapus (hancurkan) data session dari memori server
        req.session.destroy();
        // Kembalikan user ke halaman utama (Daftar Buku)
        res.redirect("/");
    },
};

module.exports = authController;
