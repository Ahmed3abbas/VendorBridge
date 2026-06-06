import { createServer } from 'http';
import app from './app.js';
import { initSocket } from './config/socket.js';
import { env } from './config/env.js';
import logger from './config/logger.js';
import db from './config/db.js';

const httpServer = createServer(app);
initSocket(httpServer);

async function start() {
  try {
    await db.$connect();
    logger.info('Database connected');
    httpServer.listen(env.PORT, () => logger.info(`Server running on port ${env.PORT}`));
  } catch (err) {
    logger.error('Startup failed', err);
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  await db.$disconnect();
  process.exit(0);
});

start();
