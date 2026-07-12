import jwt from 'jsonwebtoken';
import userRepository from '../repositories/user.repository.js';
import { USER_ROLE } from '../constants/index.js';

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
        req.userId = decoded.id;

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
        const user = await userRepository.findById(decoded.id);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.role !== USER_ROLE.ADMIN) {
            return res.json({ success: false, message: "Not Authorized as Admin" });
        }

        req.userId = decoded.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Not Authorized or Admin Token Invalid" });
    }
};

export { authUser, authAdmin };
