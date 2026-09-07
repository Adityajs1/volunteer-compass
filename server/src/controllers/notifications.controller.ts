import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import * as notificationService from '../services/notification.service';

export const getNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const data = await notificationService.getUserNotifications(req.user!.id, skip, limit);

  res.status(200).json({
    success: true,
    message: 'Notifications fetched successfully',
    data
  });
});

export const markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const notification = await notificationService.markNotificationAsRead(req.params.id, req.user!.id);

  if (!notification) {
    res.status(404).json({ success: false, message: 'Notification not found' });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    data: notification
  });
});

export const markAllAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  await notificationService.markAllAsRead(req.user!.id);

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read',
    data: null
  });
});
