import express from 'express';
import session from './sessionRoutes.js';
import greenhouse from './greenhouseRoutes.js';
import homeRoutes from './homeRoutes.js';

import Log from '../utils/log.js';

const router = express.Router();


// Middleware para loguear el path, método y IP de origen
router.use((req, res, next) => {
  const method = req.method;
  const path = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;

  Log.info(`Request received - Method: ${method}, Path: ${path}, IP: ${ip}`);

  next();
});


router.use('/session', session);
router.use('/greenhouse', greenhouse);
router.use('/home', homeRoutes);

export default router;
