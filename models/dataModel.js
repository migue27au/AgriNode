// models/dataModel.js
import db from '../config/db.js';

class Data {
  constructor(id, greenhouseId, timestamp, jsonData) {
    this.id = id;
    this.greenhouseId = greenhouseId;
    this.timestamp = timestamp;
    this.jsonData = jsonData;
  }

  toJSON() {
    return {
      id: this.id,
      greenhouseId: this.greenhouseId,
      timestamp: this.timestamp,
      jsonData: this.jsonData
    };
  }

}

export const createData = async (greenhouseId, jsonData) => {
  const result = await db.query(
    'INSERT INTO datas (greenhouse, json_data, timestamp) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING id, greenhouse, timestamp, json_data',
    [greenhouseId, JSON.stringify(jsonData)]
  );
  
  return new Data(...Object.values(result.rows[0]));
}

export const getDataByGreenhouseId = async (greenhouseId) => {
  const result = await db.query(
    'SELECT * FROM datas WHERE greenhouse = $1 ORDER BY timestamp DESC LIMIT 10',
    [greenhouseId]
  );
  
  return result.rows.map(row => new Data(...Object.values(row)));
}

export default Data;
