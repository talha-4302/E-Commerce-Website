import jwt from 'jsonwebtoken';
import db from '../config/database.js';

// Middleware for User Routes
const authUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.json({ success: false, message: "Not Authorized. Login Again" });
        }

        const token = authHeader.split(" ")[1];
        
        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_jwt_secret");
        
        // Pass the user ID to the next middleware or controller
        if (!req.body) req.body = {};
        req.body.userId = decoded.id;
        
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Token is invalid or expired. Please login again." });
    }
};

// Middleware for Admin Routes
const authAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.json({ success: false, message: "Not Authorized. Login Again" });
        }

        const token = authHeader.split(" ")[1];
        
        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_jwt_secret");
        
        // Verify user is actually an admin in the database
        const [rows] = await db.execute("SELECT * FROM users WHERE id = ? LIMIT 1", [decoded.id]);
        
        if (rows.length === 0) {
             return res.json({ success: false, message: "User not found" });
        }

        if (rows[0].role !== 'admin') {
             return res.json({ success: false, message: "Not Authorized as Admin" });
        }
        
        if (!req.body) req.body = {};
        req.body.userId = decoded.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Not Authorized or Admin Token Invalid" });
    }
};

export { authUser, authAdmin };
