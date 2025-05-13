import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes/index.js';

import { initDB } from './config/init_db.js'

import Log from './utils/log.js';
import { fileURLToPath } from 'url';
const log = new Log(fileURLToPath(import.meta.url));

log.info("Starting");

dotenv.config();  // cargo las variables de entorno
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', router);

app.listen(3000, () => {
  log.ok('AgriNode backend running on port 3000');
});

initDB();