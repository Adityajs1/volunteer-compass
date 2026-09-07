import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { env } from './config/env';

let io: SocketServer;

export const initSocket = (httpServer: HttpServer): SocketServer => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: env.clientUrl,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Join a personal room using userId for targeted notifications
    socket.on('join', (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`Socket ${socket.id} joined room: user:${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Emit a notification to a specific user by userId.
 * Call this from anywhere in your services:
 *   emitToUser(userId, 'notification', payload)
 */
export const emitToUser = (
  userId: string,
  event: string,
  data: unknown
): void => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

export { io };
