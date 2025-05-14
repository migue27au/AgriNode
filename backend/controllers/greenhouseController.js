import jwt from 'jsonwebtoken';
const { JsonWebTokenError, TokenExpiredError } = jwt;

import pool from '../config/db.js';

import Log from '../utils/log.js';

import * as greenhouseService from '../services/greenhouseService.js';

export const createGreenhouse = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ status: 401, error: 'Unauthorized', message: 'Token not provided' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res.status(401).json({ status: 401, error: 'TokenExpired', message: 'JWT has expired' });
    } else if (err instanceof JsonWebTokenError) {
      return res.status(401).json({ status: 401, error: 'InvalidToken', message: 'JWT is invalid' });
    } else {
      Log.bad(err.stack);
      return res.status(500).json({ status: 500, error: 'AuthenticationError', message: 'Unknown JWT error' });
    }
  }

  const ownerId = decoded.id;
  const { alias } = req.body;
  if (!alias) {
    return res.status(400).json({ status: 400, error: 'Bad Request', message: 'alias are required' });
  }
  
  try {
    const result = await greenhouseService.newGreenhouse(ownerId, alias);

    if (!result.success) {
      return res.status(400).json({
        status: 400,
        error: 'Error',
        message: result.message,
        data: {}
      });
    }

    res.status(201).json({
      status: 201,
      error: '',
      message: 'Greenhouse created successfully',
      data: result.greenhouse
    });

  } catch (err) {
    Log.bad(`Error creating greenhouse: ${err.message}`);
    Log.bad(err.stack);
    res.status(500).json({ status: 500, error: 'Internal Server Error', message: err.message });
  }
};