// models/greenhouseConfigurationModel.js
import db from '../config/db.js';

class GreenhouseConfiguration {
  constructor(id, greenhouseId, configKey, configValue) {
    this.id = id;
    this.greenhouseId = greenhouseId;
    this.configKey = configKey;
    this.configValue = configValue;
  }

  toJSON() {
    return {
      id: this.id,
      greenhouseId: this.greenhouseId,
      configKey: this.configKey,
      configValue: this.configValue
    };
  }
}

export const createConfiguration = async (greenhouseId, configKey, configValue) => {
  const result = await db.query(
    'INSERT INTO greenhouse_configurations (greenhouse, config_key, config_value) VALUES ($1, $2, $3) RETURNING id, greenhouse, config_key, config_value',
    [greenhouseId, configKey, configValue]
  );

  return new GreenhouseConfiguration(...Object.values(result.rows[0]));
};


export const updateConfiguration = async (id, greenhouseId, configKey, configValue) => {
  // Primero verificamos si la configuración existe para ese invernadero
  const result = await db.query(
    'SELECT * FROM greenhouse_configurations WHERE id = $1 AND greenhouse = $2',
    [id, greenhouseId]  // Añadimos la condición de que el greenhouse debe coincidir
  );

  if (result.rows.length === 0) {
    throw new Error(`Configuration with ID ${id} does not exist for greenhouse with ID ${greenhouseId}.`);
  }

  const updatedResult = await db.query(
    'UPDATE greenhouse_configurations SET config_key = $1, config_value = $2 WHERE id = $3 AND greenhouse = $4 RETURNING id, greenhouse, config_key, config_value',
    [configKey, configValue, id, greenhouseId]  // Añadimos la condición de que el greenhouse debe coincidir
  );

  return new GreenhouseConfiguration(...Object.values(updatedResult.rows[0]));
};

export const deleteConfiguration = async (id, greenhouseId) => {
  const result = await db.query(
    'SELECT * FROM greenhouse_configurations WHERE id = $1 AND greenhouse = $2',
    [id, greenhouseId]  // Añadimos la condición de que el greenhouse debe coincidir
  );

  if (result.rows.length === 0) {
    throw new Error(`Configuration with ID ${id} does not exist for greenhouse with ID ${greenhouseId}.`);
  }

  const deleteResult = await db.query(
    'DELETE FROM greenhouse_configurations WHERE id = $1 AND greenhouse = $2 RETURNING id',
    [id, greenhouseId]  // Añadimos la condición de que el greenhouse debe coincidir
  );

  return deleteResult.rows.length > 0;
};


export const deleteAllConfigurationsByGreenhouse = async (greenhouseId) => {
  // Verificamos que el invernadero exista antes de proceder con la eliminación
  const greenhouseExists = await validateGreenhouseExistence(greenhouseId);
  if (!greenhouseExists) {
    throw new Error(`Greenhouse with ID ${greenhouseId} does not exist.`);
  }

  // Realizamos la eliminación de todas las configuraciones asociadas al invernadero
  const deleteResult = await db.query(
    'DELETE FROM greenhouse_configurations WHERE greenhouse = $1 RETURNING id',
    [greenhouseId]
  );

  // Si se han eliminado configuraciones, retornamos true
  return deleteResult.rows.length > 0;
};


export default GreenhouseConfiguration;

