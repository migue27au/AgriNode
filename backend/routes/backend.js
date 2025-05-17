import express from 'express';
import session from './sessionRoutes.js';
import greenhouse from './greenhouseRoutes.js';
import homeRoutes from './homeRoutes.js';

import Log from '../utils/log.js';

const router = express.Router();


router.use('/session', session);
router.use('/greenhouse', greenhouse);
router.use('/home', homeRoutes);

export default router;
