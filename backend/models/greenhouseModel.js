// models/greenhouseModel.js
import db from '../config/db.js';

class Greenhouse {
  constructor(id, name, userId, alias, apitoken, createdAt, lastActiveAt) {
    this.id = id;
    this.name = name;
    this.userId = userId;
    this.alias = alias;
    this.apitoken = apitoken;
    this.createdAt = createdAt;
    this.lastActiveAt = lastActiveAt;
  }

  static async createGreenhouse(name, userId, alias, apitoken) {
    const result = await db.query(
      'INSERT INTO greenhouses (name, user_id, alias, apitoken, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id, name, user_id, alias, apitoken, created_at, last_active_timestamp',
      [name, userId, alias, apitoken]
    );
    
    return new Greenhouse(...Object.values(result.rows[0]));
  }

  static async getGreenhouseById(id) {
    const result = await db.query(
      'SELECT * FROM greenhouses WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) return null;
    return new Greenhouse(...Object.values(result.rows[0]));
  }

  static async updateGreenhouse(id, alias, apitoken) {
    const result = await db.query(
      'UPDATE greenhouses SET alias = $1, apitoken = $2, last_active_timestamp = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, name, user_id, alias, apitoken, created_at, last_active_timestamp',
      [alias, apitoken, id]
    );
    
    return new Greenhouse(...Object.values(result.rows[0]));
  }
}

export default Greenhouse;
