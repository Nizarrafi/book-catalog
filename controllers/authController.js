const bcrypt = require("bcrypt");
const User = require("../models/User");

const authController = {
    // Views
    getLogin: (req, res) => {
        res.render("login");
    },
    getRegister: (req, res) => {
        res.render("register");
    },

    // Actions
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create(name, email, hashedPassword);
            res.redirect("/auth/login");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error registering user");
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findByEmail(email);

            if (!user) return res.render("login", { error: "User not found" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.render("login", { error: "Wrong password" });

            req.session.userId = user.id;
            req.session.userName = user.name;
            res.redirect("/");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error logging in");
        }
    },

    logout: (req, res) => {
        req.session.destroy();
        res.redirect("/auth/login");
    },
};

module.exports = authController;
