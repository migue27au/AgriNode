import express from 'express';

import path from 'path';
import { fileURLToPath } from 'url';

// Esto reemplaza __filename y __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import Log from '../utils/log.js';

const router = express.Router();


router.use('/static', express.static(path.join(__dirname, 'static')));

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
});

router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/dashboard.html'));
});


export default router;
