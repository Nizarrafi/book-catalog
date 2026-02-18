const pool = require("../config/db");

const createTables = async () => {
  const userTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const bookTable = `
    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      author VARCHAR(100) NOT NULL,
      year INTEGER,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(userTable);
    console.log("Users table created.");
    await pool.query(bookTable);
    console.log("Books table created.");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
};

module.exports = createTables;
