import { Router } from 'express';
import { getMyRsvps, createRsvp, updateStatus, getMyHours, checkIn } from '../controllers/rsvps.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// Volunteers getting their basic RSVPs or creating one
router.get('/', getMyRsvps);
router.get('/my-hours', getMyHours);
router.post('/', createRsvp);

// Organizer updating status of an RSVP
router.patch('/:id/status', requireRole(['ORGANIZER', 'ADMIN']), updateStatus);
router.patch('/:id/checkin', requireRole(['ORGANIZER', 'ADMIN']), checkIn);

export default router;
