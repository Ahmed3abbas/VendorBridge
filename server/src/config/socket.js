import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from './env.js';
import logger from './logger.js';

let io;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: env.CLIENT_URL, credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      socket.user = jwt.verify(token, env.JWT_SECRET);
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(`user:${socket.user.id}`);
    logger.debug(`Socket connected: ${socket.user.id}`);
    socket.on('disconnect', () => logger.debug(`Socket disconnected: ${socket.user.id}`));
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}

export function emitToUser(userId, event, data) {
  getIO().to(`user:${userId}`).emit(event, data);
}
