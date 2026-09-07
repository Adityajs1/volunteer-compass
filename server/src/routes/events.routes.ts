import { Router } from 'express';
import { listEvents, getEvent, createEvent, updateEvent, deleteEvent } from '../controllers/events.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', listEvents);
router.get('/:id', getEvent);

// Protected routes (Organizer only for modifications)
router.use(authenticate);

router.post('/', requireRole(['ORGANIZER', 'ADMIN']), createEvent);
router.put('/:id', requireRole(['ORGANIZER', 'ADMIN']), updateEvent);
router.delete('/:id', requireRole(['ORGANIZER', 'ADMIN']), deleteEvent);

export default router;
