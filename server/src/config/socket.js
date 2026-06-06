import { Server } from 'socket.io';
import { env } from './env.js';

let io;

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: env.CLIENT_URL, credentials: true },
  });

  io.on('connection', (socket) => {
    socket.on('join:room', (roomId) => socket.join(roomId));
    socket.on('leave:room', (roomId) => socket.leave(roomId));
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}
