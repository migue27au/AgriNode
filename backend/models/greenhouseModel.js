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

export const getGreenhousesOfOwner = async (ownerId) => {
  const result = await db.query(
    'SELECT * FROM greenhouses WHERE owner = $1',
    [ownerId]
  );

  if (result.rows.length === 0) return [];

  return result.rows.map(row => new Greenhouse(
    row.id,
    row.owner,
    row.alias,
    row.apitoken,
    row.creation_timestamp,
    row.last_active_timestamp
  ));
}

export const getGreenhouseByApitoken = async (apitoken) => {
  const result = await db.query(
    'SELECT * FROM greenhouses WHERE apitoken = $1',
    [apitoken]
  );

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return new Greenhouse(
    row.id,
    row.owner,
    row.alias,
    row.apitoken,
    row.creation_timestamp,
    row.last_active_timestamp
  );
};

export const getGreenhouseById = async (id) => {
  const result = await db.query(
    'SELECT * FROM greenhouses WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) return null;
  return new Greenhouse(...Object.values(result.rows[0]));
}


export const updateLastActiveTimestamp = async (id) => {
  const result = await db.query(
    'UPDATE greenhouses SET last_active_timestamp = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, owner, alias, apitoken, creation_timestamp, last_active_timestamp',
    [id]
  );

  if (result.rows.length === 0) return null;

  return new Greenhouse(
    result.rows[0].id,
    result.rows[0].owner,
    result.rows[0].alias,
    result.rows[0].apitoken,
    result.rows[0].lastActiveTimestamp,
    result.rows[0].lastActiveTimestamp
  );
};


export const updateGreenhouse = async (id, alias, apitoken) => {
  const result = await db.query(
    'UPDATE greenhouses SET alias = $1, apitoken = $2, last_active_timestamp = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, owner, alias, apitoken, creation_timestamp, last_active_timestamp',
    [alias, apitoken, id]
  );

  if (result.rows.length === 0) return null;

  return new Greenhouse(
    result.rows[0].id,
    result.rows[0].owner,
    result.rows[0].alias,
    result.rows[0].apitoken,
    result.rows[0].lastActiveTimestamp,
    result.rows[0].lastActiveTimestamp
  );
};


export const deleteGreenhouseByOwner = async (id, ownerId) => {
  const result = await db.query(
    'DELETE FROM greenhouses WHERE id = $1 AND owner = $2 RETURNING id',
    [id, ownerId]
  );

  return result.rows.length > 0;
};


export default Greenhouse;


