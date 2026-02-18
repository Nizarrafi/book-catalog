const express = require("express");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const app = express();

// Middleware Global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "my-library-secret-key-don-t-change",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set into true if using HTTPS
}));
app.use(express.static("public"));

app.set("view engine", "ejs");

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/books", require("./routes/product")); // Using the same file but mounted at /books

// Home Route (Redirect to Book List)
app.get("/", (req, res) => {
  res.redirect("/books");
});

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).render("404", { url: req.originalUrl }); // You might need to create a 404 view
});

const createTables = require("./models/init");

const PORT = process.env.PORT || 3000;

// Initialize DB and Start Server
createTables().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});