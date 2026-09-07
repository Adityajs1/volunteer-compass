import { PrismaClient, NotificationType } from '@prisma/client';
import { emitToUser } from '../socket';

const prisma = new PrismaClient();

// ─── Create a notification and emit via Socket ────────────────
export const createNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  body: string,
  metadata?: any
) => {
  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      body,
      metadata: metadata ? metadata : undefined,
    },
  });

  // Emit to connected user instantly
  emitToUser(userId, 'new_notification', notification);

  return notification;
};

// ─── Get user's notifications (paginated) ─────────────────────
export const getUserNotifications = async (
  userId: string,
  skip = 0,
  take = 20
) => {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    skip: Number(skip),
    take: Number(take),
    orderBy: { createdAt: 'desc' },
  });

  const unreadCount = await prisma.notification.count({
    where: { userId, isRead: false },
  });

  return { notifications, unreadCount };
};

// ─── Mark a specific notification as read ─────────────────────
export const markNotificationAsRead = async (
  id: string,
  userId: string
) => {
  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification || notification.userId !== userId) {
    return null; // Or throw error
  }

  return await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
};

// ─── Mark all notifications as read for a user ────────────────
export const markAllAsRead = async (userId: string) => {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });

  return true;
};
