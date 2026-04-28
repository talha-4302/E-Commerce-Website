import db from "../../config/database.js";

// @desc    Get all users with order counts
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // --- Step 1: Count total matching users (for pagination) ---
        // Optimization: No JOIN needed for counting total users
        const [countRows] = await db.execute(
            "SELECT COUNT(*) AS total FROM users WHERE role != 'admin'"
        );
        const totalItems = countRows[0].total;
        const totalPages = Math.ceil(totalItems / limit);

        // --- Step 2: Get paginated users with order counts ---
        const query = `
            SELECT u.id, u.name, u.email, u.account_status, u.created_at,
                   COUNT(o.id) AS order_count
            FROM users u
            LEFT JOIN orders o ON u.id = o.user_id
            WHERE u.role != 'admin'
            GROUP BY u.id
            ORDER BY u.created_at DESC
            LIMIT ? OFFSET ?
        `;

        const [users] = await db.execute(query, [limit, offset]);

        res.json({ 
            success: true, 
            users,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                limit
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Update user status (ban/unban)
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { account_status } = req.body;

        if (!['active', 'banned'].includes(account_status)) {
            return res.json({ success: false, message: "Invalid status value" });
        }

        const [result] = await db.execute(
            "UPDATE users SET account_status = ? WHERE id = ? AND role != 'admin'",
            [account_status, id]
        );

        if (result.affectedRows === 0) {
            return res.json({ success: false, message: "User not found or user is an admin" });
        }

        res.json({ success: true, message: "User status updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { getAllUsers, updateUserStatus };
