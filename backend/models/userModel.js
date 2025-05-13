import db from '../config/db.js';

export const findUserByUsername = async (username) => {
  try {
    const res = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    return res.rows[0];
  } catch (err) {
    console.error('DB error:', err);
    return null;
  }
};
