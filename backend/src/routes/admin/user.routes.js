import express from 'express';
import { getAllUsers, updateUserStatus } from '../../controllers/admin/user.controller.js';

const router = express.Router();

router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);

export default router;
