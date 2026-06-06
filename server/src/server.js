import { createServer } from 'http';
import app from './app.js';
import { env } from './config/env.js';
import { initSocket } from './config/socket.js';
import logger from './config/logger.js';

const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
});
