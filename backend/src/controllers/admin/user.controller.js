import userService from '../../services/user.service.js';
import catchAsync from '../../utils/catchAsync.js';

const getAllUsers = catchAsync(async (req, res) => {
    const { users, pagination } = await userService.listUsers(req.query);
    res.json({ success: true, users, pagination });
});

const updateUserStatus = catchAsync(async (req, res) => {
    await userService.updateUserStatus(req.params.id, req.body.account_status);
    res.json({ success: true, message: "User status updated successfully" });
});

export { getAllUsers, updateUserStatus };
