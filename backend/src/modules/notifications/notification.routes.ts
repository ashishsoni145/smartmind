import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { requireAuth } from '../../middleware/auth';
import { resolveStudentProfile } from '../../middleware/identity';

const router = Router();

// Require student authentication and resolve student profile
router.use(requireAuth);
router.use(resolveStudentProfile);

router.get('/preferences', NotificationController.getPreferences);
router.patch('/preferences', NotificationController.updatePreferences);
router.get('/', NotificationController.listNotifications);
router.post('/', NotificationController.createNotification);
router.get('/action-required', NotificationController.getPendingActionRequired);
router.patch('/:notificationId/read', NotificationController.markAsRead);
router.post('/read-all', NotificationController.markAllAsRead);

export { router as notificationRoutes };
