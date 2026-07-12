import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import userRepository from '../repositories/user.repository.js';
import AppError from '../utils/AppError.js';
import { ACCOUNT_STATUS, USER_ROLE } from '../constants/index.js';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "default_jwt_secret", { expiresIn: "7d" });
};

const login = async (email, password) => {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new AppError("User doesn't exist");

    if (user.account_status === ACCOUNT_STATUS.BANNED) {
        throw new AppError("Your account has been suspended.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError("Invalid credentials");

    return { token: createToken(user.id), userName: user.name };
};

const register = async (name, email, password) => {
    const exists = await userRepository.existsByEmail(email);
    if (exists) throw new AppError("User already exists");

    if (!validator.isEmail(email)) {
        throw new AppError("Please enter a valid email");
    }
    if (password.length < 4) {
        throw new AppError("Please enter a strong password");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUserId = await userRepository.create({ name, email, hashedPassword });

    return { token: createToken(newUserId), userName: name };
};

const adminLogin = async (email, password) => {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new AppError("Invalid credentials");

    if (user.role !== USER_ROLE.ADMIN) {
        throw new AppError("You are not authorized as an Admin.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError("Invalid credentials");

    return { token: createToken(user.id) };
};

// --- admin ---

const listUsers = async (query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const totalItems = await userRepository.countNonAdminUsers();
    const totalPages = Math.ceil(totalItems / limit);
    const users = await userRepository.findUsersPaginated(limit, offset);

    return { users, pagination: { currentPage: page, totalPages, totalItems, limit } };
};

const updateUserStatus = async (id, accountStatus) => {
    if (!Object.values(ACCOUNT_STATUS).includes(accountStatus)) {
        throw new AppError("Invalid status value");
    }

    const affectedRows = await userRepository.updateAccountStatus(id, accountStatus);
    if (affectedRows === 0) {
        throw new AppError("User not found or user is an admin");
    }
};

export default { login, register, adminLogin, listUsers, updateUserStatus };
