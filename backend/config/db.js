import Log from '../utils/log.js';
import { fileURLToPath } from 'url';
const log = new Log(fileURLToPath(import.meta.url));

import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432
});

// Log wrapper
const originalQuery = pool.query.bind(pool);

pool.query = async (...args) => {
  const queryText = args[0];
  const queryParams = args[1] || [];
  const start = Date.now();

  try {
    const result = await originalQuery(...args);
    const duration = Date.now() - start;

    log.ok(`${queryText} | [Params] ${JSON.stringify(queryParams)} | [Rows] ${result.rowCount} | [Time] ${duration}ms`);

    return result;
  } catch (error) {
    log.bad(`[DB ERROR] ${queryText} | [Params] ${JSON.stringify(queryParams)} | [Error] ${error.message}`);
    throw error;
  }
};

export default pool;
