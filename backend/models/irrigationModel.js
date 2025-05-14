// models/irrigationModel.js
import db from '../config/db.js';

class Irrigation {
  constructor(id, greenhouseId, timestamp, irrigated) {
    this.id = id;
    this.greenhouseId = greenhouseId;
    this.timestamp = timestamp;
    this.irrigated = irrigated;
  }

  toJSON() {
    return {
      id: this.id,
      greenhouseId: this.greenhouseId,
      timestamp: this.timestamp,
      irrigated: this.irrigated
    };
  }

}
export const createIrrigation = async (greenhouseId, irrigated) => {
  const result = await db.query(
    'INSERT INTO irrigations (greenhouse, irrigated, timestamp) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING id, greenhouse, timestamp, irrigated',
    [greenhouseId, irrigated]
  );
  
  return new Irrigation(...Object.values(result.rows[0]));
}

export const getIrrigationByGreenhouseId = async (greenhouseId) => {
  const result = await db.query(
    'SELECT * FROM irrigations WHERE greenhouse = $1 ORDER BY timestamp DESC LIMIT 10',
    [greenhouseId]
  );
  
  return result.rows.map(row => new Irrigation(...Object.values(row)));
}

export default Irrigation;
