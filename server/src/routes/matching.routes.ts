import { Router } from 'express';
import { listMatches, updateStatus } from '../controllers/matching.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', listMatches);
router.patch('/:id/status', updateStatus);

export default router;
