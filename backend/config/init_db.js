import pool from './db.js';
import bcrypt from 'bcryptjs';

import Log from '../utils/log.js';

const TABLES = {
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'user',
      last_session TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
  greenhouses: `
    CREATE TABLE IF NOT EXISTS greenhouses (
      id SERIAL PRIMARY KEY,
      owner INTEGER REFERENCES users(id) ON DELETE CASCADE,
      alias VARCHAR(255) NOT NULL,
      apitoken VARCHAR(255) UNIQUE NOT NULL,
      creation_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_active_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
  datas: `
    CREATE TABLE IF NOT EXISTS datas (
      id SERIAL PRIMARY KEY,
      greenhouse INTEGER REFERENCES greenhouses(id) ON DELETE CASCADE,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      data JSONB NOT NULL
    )`,
  irrigations: `
    CREATE TABLE IF NOT EXISTS irrigations (
      id SERIAL PRIMARY KEY,
      greenhouse INTEGER REFERENCES greenhouses(id) ON DELETE CASCADE,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      irrigated BOOLEAN NOT NULL
    )`
};

async function createDefaultAdmin() {
  const username = 'admin';
  const role = 'admin';
  const password = 'admin';

  const userExists = await pool.query(
    'SELECT 1 FROM users WHERE username = $1',
    [username]
  );

  if (userExists.rows.length === 0) {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (username, password, role) VALUES ($1, $2, $3)`,
      [username, hashed, role]
    );
    Log.info('Default admin user created.');
  } else {
    Log.info('Admin user already exists.');
  }
}

export async function initDB() {
  await waitForDb();
  try {
    for (const [name, query] of Object.entries(TABLES)) {
      Log.info(`Creating table: ${name}`);
      await pool.query(query);  // <--- esto ahora se logea
    }

    await createDefaultAdmin();

    Log.ok('Initialization complete.');
  } catch (err) {
    Log.critical('Initialization failed:', err);
  }
}

const waitForDb = async (retries = 10, delay = 2000) => {
  while (retries > 0) {
    try {
      const client = await pool.connect();
      client.release();
      Log.ok('Connected successfully');
      return;
    } catch (err) {
      Log.info(`Waiting for database... (${10 - retries + 1}/10)`);
      await new Promise(res => setTimeout(res, delay));
      retries--;
    }
  }
  Log.critical('Database is not ready after multiple attempts');
  throw new Error('Database is not ready after multiple attempts');
};
