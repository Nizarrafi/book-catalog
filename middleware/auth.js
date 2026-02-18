// Middleware Keamanan (Security Middleware)
// Digunakan untuk melindungi halaman yang butuh login (seperti Tambah/Edit buku)

module.exports = function (req, res, next) {
  // Cek apakah di memori Session server ada ID User-nya
  if (!req.session.userId) {
    // Jika TIDAK ADA (belum login), tendang user ke halaman login
    return res.redirect("/auth/login");
  }

  // Jika ADA (sudah login), izinkan user melanjutkan ke tujuan selanjutnya
  next();
};