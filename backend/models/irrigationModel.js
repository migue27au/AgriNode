// models/irrigationModel.js
import db from '../config/db.js';

class Irrigation {
  constructor(id, greenhouseId, timestamp, isWatered) {
    this.id = id;
    this.greenhouseId = greenhouseId;
    this.timestamp = timestamp;
    this.isWatered = isWatered;
  }

  toJSON() {
    return {
      id: this.id,
      greenhouseId: this.greenhouseId,
      timestamp: this.timestamp,
      isWatered: this.isWatered
    };
  }

  static async createIrrigation(greenhouseId, isWatered) {
    const result = await db.query(
      'INSERT INTO irrigations (greenhouse_id, is_watered, timestamp) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING id, greenhouse_id, timestamp, is_watered',
      [greenhouseId, isWatered]
    );
    
    return new Irrigation(...Object.values(result.rows[0]));
  }

  static async getIrrigationByGreenhouseId(greenhouseId) {
    const result = await db.query(
      'SELECT * FROM irrigations WHERE greenhouse_id = $1 ORDER BY timestamp DESC LIMIT 10',
      [greenhouseId]
    );
    
    return result.rows.map(row => new Irrigation(...Object.values(row)));
  }
}

export default Irrigation;
