import { Router } from 'express';
import { getProfile, updateProfile, getUsers } from '../controllers/users.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// All user routes require authentication minimum
router.use(authenticate);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Admin routes
router.get('/', requireRole(['ADMIN']), getUsers);

export default router;
