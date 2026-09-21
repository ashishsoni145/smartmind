import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();

// Require student authentication
router.use(requireAuth);

router.get('/preferences', NotificationController.getPreferences);
router.patch('/preferences', NotificationController.updatePreferences);
router.get('/', NotificationController.listNotifications);
router.post('/', NotificationController.createNotification);
router.get('/action-required', NotificationController.getPendingActionRequired);
router.patch('/:notificationId/read', NotificationController.markAsRead);
router.post('/read-all', NotificationController.markAllAsRead);

export { router as notificationRoutes };
