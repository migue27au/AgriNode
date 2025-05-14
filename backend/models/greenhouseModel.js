// models/greenhouseModel.js
import db from '../config/db.js';

class Greenhouse {
  constructor(id, ownerId, alias, apitoken, creationTimestamp, lastActiveTimestamp) {
    this.id = id;
    this.ownerId = ownerId;
    this.alias = alias;
    this.apitoken = apitoken;
    this.creationTimestamp = creationTimestamp;
    this.lastActiveTimestamp = lastActiveTimestamp;
  }

  toJSON() {
    return {
      id: this.id,
      ownerId: this.ownerId,
      alias: this.alias,
      apitoken: this.apitoken,
      creationTimestamp: this.creationTimestamp,
      lastActiveTimestamp: this.lastActiveTimestamp
    };
  }

}

export const createGreenhouse = async (ownerId, alias, apitoken) => {
  const result = await db.query(
    'INSERT INTO greenhouses (owner, alias, apitoken, creation_timestamp) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING id, owner, alias, apitoken, creation_timestamp, last_active_timestamp',
    [ownerId, alias, apitoken]
  );

  return new Greenhouse(...Object.values(result.rows[0]));
}

export const getGreenhouseById = async (id) => {
  const result = await db.query(
    'SELECT * FROM greenhouses WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) return null;
  return new Greenhouse(...Object.values(result.rows[0]));
}

export const updateGreenhouse = async (id, alias, apitoken) => {
  const result = await db.query(
    'UPDATE greenhouses SET alias = $1, apitoken = $2, last_active_timestamp = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, owner, alias, apitoken, creation_timestamp, last_active_timestamp',
    [alias, apitoken, id]
  );

  return new Greenhouse(...Object.values(result.rows[0]));
}

export default Greenhouse;
