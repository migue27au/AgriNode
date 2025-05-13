import express from 'express';
import session from './session.js';
import homeRoutes from './homeRoutes.js';

import Log from '../utils/log.js';
import { fileURLToPath } from 'url';
const log = new Log(fileURLToPath(import.meta.url));

const router = express.Router();


// Middleware para loguear el path, método y IP de origen
router.use((req, res, next) => {
  const method = req.method;
  const path = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;

  log.info(`Request received - Method: ${method}, Path: ${path}, IP: ${ip}`);

  next();
});


router.use('/session', session);
router.use('/home', homeRoutes);

export default router;
