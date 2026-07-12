import db from '../config/database.js';

const findByEmail = async (email) => {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
    return rows[0] || null;
};

const findById = async (id) => {
    const [rows] = await db.execute("SELECT * FROM users WHERE id = ? LIMIT 1", [id]);
    return rows[0] || null;
};

const existsByEmail = async (email) => {
    const [rows] = await db.execute("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
    return rows.length > 0;
};

const create = async ({ name, email, hashedPassword }) => {
    const [result] = await db.execute(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
    );
    return result.insertId;
};

// --- admin ---

const countNonAdminUsers = async () => {
    const [rows] = await db.execute("SELECT COUNT(*) AS total FROM users WHERE role != 'admin'");
    return rows[0].total;
};

const findUsersPaginated = async (limit, offset) => {
    const query = `
        SELECT u.id, u.name, u.email, u.account_status, u.created_at,
               COUNT(o.id) AS order_count
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        WHERE u.role != 'admin'
        GROUP BY u.id
        ORDER BY u.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
    `;
    const [rows] = await db.execute(query);
    return rows;
};

const updateAccountStatus = async (id, accountStatus) => {
    const [result] = await db.execute(
        "UPDATE users SET account_status = ? WHERE id = ? AND role != 'admin'",
        [accountStatus, id]
    );
    return result.affectedRows;
};

export default {
    findByEmail,
    findById,
    existsByEmail,
    create,
    countNonAdminUsers,
    findUsersPaginated,
    updateAccountStatus
};
