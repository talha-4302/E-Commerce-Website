import userService from '../services/user.service.js';
import catchAsync from '../utils/catchAsync.js';

const loginUser = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const { token, userName } = await userService.login(email, password);
    res.json({ success: true, token, userName });
});

const registerUser = catchAsync(async (req, res) => {
    const { name, email, password } = req.body;
    const { token, userName } = await userService.register(name, email, password);
    res.json({ success: true, token, userName });
});

const adminLogin = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const { token } = await userService.adminLogin(email, password);
    res.json({ success: true, token });
});

const verifyToken = (req, res) => {
    // If the middleware passed, the token is valid
    res.json({ success: true, message: "Token is valid" });
};

export { loginUser, registerUser, adminLogin, verifyToken };
