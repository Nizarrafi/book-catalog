// Middleware Tamu (Guest Middleware)
// Digunakan untuk mencegah user yang SUDAH login mengakses halaman Login/Register lagi

module.exports = function (req, res, next) {
    // Jika di session SUDAH ADA ID user (artinya sudah login)
    if (req.session.userId) {
        // Alihkan (paksa balik) ke halaman utama
        return res.redirect("/");
    }
    // Jika belum login, barulah izinkan akses halaman login/register
    next();
};
