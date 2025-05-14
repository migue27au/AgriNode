import express from 'express';
import { createGreenhouse } from '../controllers/greenhouseController.js';

const router = express.Router();

router.post('/create', createGreenhouse);

export default router;
