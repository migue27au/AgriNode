import pg from 'pg';
const { Client } = pg;

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'user',
  password: 'password',
  database: 'irrigation'
});

const TABLES = {
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
  greenhouses: `
    CREATE TABLE IF NOT EXISTS greenhouses (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      user_id INTEGER REFERENCES users(id),
      location TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
};

async function initDB() {
  try {
    await client.connect();
    for (const [name, query] of Object.entries(TABLES)) {
      console.log(`Creating table: ${name}`);
      await client.query(query);
    }
    console.log('DB Init complete.');
  } catch (err) {
    console.error('Error initializing DB:', err);
  } finally {
    await client.end();
  }
}

initDB();
