import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import backend from './routes/backend.js';
import frontend from './routes/frontend.js';


import { initDB } from './config/init_db.js'

import Log from './utils/log.js';

Log.info("Starting");

dotenv.config();  // cargo las variables de entorno
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

// Middleware para loguear el path, método y IP de origen
app.use((req, res, next) => {
  const method = req.method;
  const path = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;

  Log.info(`Request received - Method: ${method}, Path: ${path}, IP: ${ip}`);

  next();
});


app.use('/api', backend);
app.use('/app', frontend);



app.listen(3000, () => {
  Log.ok('AgriNode backend running on port 3000');
});

initDB();