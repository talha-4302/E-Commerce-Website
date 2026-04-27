import db from "../config/database.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "default_jwt_secret", { expiresIn: "7d" });
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Query user by email
        const [rows] = await db.execute("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);

        if (rows.length === 0) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const user = rows[0];

        // Check if user is banned
        if (user.account_status === 'banned') {
            return res.json({ success: false, message: "Your account has been suspended." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user.id);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const [exists] = await db.execute("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);

        if (exists.length > 0) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Validate formats
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 4) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user (default role is 'user') via Raw SQL Insert
        const [result] = await db.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );

        const newUserId = result.insertId;
        const token = createToken(newUserId);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [rows] = await db.execute("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
        if (rows.length === 0) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const user = rows[0];

        // Check if role is admin
        if (user.role !== 'admin') {
            return res.json({ success: false, message: "You are not authorized as an Admin." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user.id);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const verifyToken = async (req, res) => {
    // If the middleware passed, the token is valid
    res.json({ success: true, message: "Token is valid" });
}

export { loginUser, registerUser, adminLogin, verifyToken };
