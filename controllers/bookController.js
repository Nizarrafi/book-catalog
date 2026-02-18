const Book = require("../models/Book");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({ region: process.env.AWS_REGION });

const bookController = {
    getAll: async (req, res) => {
        try {
            const books = await Book.getAll();
            res.render("index", { books, user: req.session.userName });
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error");
        }
    },

    getAddPage: (req, res) => {
        res.render("add-book");
    },

    getEditPage: async (req, res) => {
        try {
            const { id } = req.params;
            const book = await Book.getById(id);
            if (!book) return res.status(404).send("Book not found");
            res.render("edit-book", { book });
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error");
        }
    },

    create: async (req, res) => {
        try {
            const { title, author, year } = req.body;
            let image_url = null;

            if (req.file) {
                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: `books/${Date.now()}_${req.file.originalname}`,
                    Body: req.file.buffer,
                    ContentType: req.file.mimetype
                };
                const uploadResult = await s3.upload(params).promise();
                image_url = uploadResult.Location;
            }

            await Book.create(title, author, year, image_url);
            res.redirect("/");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error adding book");
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, author, year } = req.body;
            const existingBook = await Book.getById(id);
            if (!existingBook) return res.status(404).send("Book not found");

            let image_url = existingBook.image_url;

            if (req.file) {
                // Delete old image if it exists
                if (existingBook.image_url) {
                    try {
                        const url = new URL(existingBook.image_url);
                        const key = decodeURIComponent(url.pathname.substring(1));
                        await s3.deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: key }).promise();
                    } catch (e) {
                        console.error("Failed to delete old image:", e.message);
                    }
                }

                // Upload new image
                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: `books/${Date.now()}_${req.file.originalname}`,
                    Body: req.file.buffer,
                    ContentType: req.file.mimetype
                };
                const uploadResult = await s3.upload(params).promise();
                image_url = uploadResult.Location;
            }

            await Book.update(id, title, author, year, image_url);
            res.redirect("/");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error updating book");
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const book = await Book.getById(id);

            if (book && book.image_url) {
                const url = new URL(book.image_url);
                const key = decodeURIComponent(url.pathname.substring(1));
                await s3.deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: key }).promise();
            }

            await Book.delete(id);
            res.redirect("/");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error deleting book");
        }
    },
};

module.exports = bookController;
