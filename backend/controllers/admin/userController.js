import db from "../../config/database.js";

// @desc    Get all users with order counts
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
    try {
        const query = `
            SELECT u.id, u.name, u.email, u.account_status, u.created_at,
                   COUNT(o.id) AS order_count
            FROM users u
            LEFT JOIN orders o ON u.id = o.user_id
            WHERE u.role != 'admin'
            GROUP BY u.id
            ORDER BY u.created_at DESC
        `;

        const [users] = await db.execute(query);

        res.json({ success: true, users });
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
