import * as greenhouseModel from '../models/greenhouseModel.js';
import * as greenhouseConfigurationModel from '../models/greenhouseConfigurationModel.js';
import * as irrigationModel from '../models/irrigationModel.js';
import * as dataModel from '../models/dataModel.js';
import * as userModel from '../models/userModel.js';


import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import Log from '../utils/log.js';

import { authenticateGreenhouse as authGreenhouse } from '../utils/authentication.js';

export const newGreenhouse = async (ownerId, alias) => {
  const existingGreenhouses = await greenhouseModel.getGreenhousesOfOwner(ownerId);

  const aliasExists = existingGreenhouses.some(
    greenhouse => greenhouse.alias.toLowerCase() === alias.toLowerCase()
  );

  if (aliasExists) {
    Log.warn(`Alias '${alias}' already exists for user ${ownerId}`);
    return { success: false, message: 'Alias already in use for this user.' };
  }

  // Crear token único para el nuevo invernadero
  const apitoken = crypto.randomBytes(8).toString('hex').toUpperCase();

  Log.info(`Creating new greenhouse with alias: ${alias} by user ${ownerId}`);
  const greenhouseCreated = await greenhouseModel.createGreenhouse(ownerId, alias, apitoken);

  Log.ok(`Greenhouse created: ${greenhouseCreated.alias} by user ${ownerId}`);

  return { success: true, message: 'Ok', greenhouse: greenhouseCreated.toJSON() };
};


export const getGreenhousesByOwnerId = async (ownerId) => {
  Log.ok(`Fetching greenhouses for user ${ownerId}`);

  const greenhouses = await greenhouseModel.getGreenhousesOfOwner(ownerId);

  if (!greenhouses || greenhouses.length === 0) {
    Log.warn(`No greenhouses found for user ${ownerId}`);
    return { success: true, message: 'Ok', greenhouses: [] };
  }

  const greenhouseList = greenhouses.map(g => g.toJSON());

  Log.ok(`Found ${greenhouseList.length} greenhouses for user ${ownerId}`);

  return { success: true, message: 'Ok', greenhouses: greenhouseList };
};


export const updateGreenhouseByOwnerId = async (id, ownerId, alias, apitoken) => {
  const greenhouses = await greenhouseModel.getGreenhousesOfOwner(ownerId);

  // Verifica si existe otro greenhouse con el mismo alias
  const aliasConflict = greenhouses.some(g =>
    g.alias.toLowerCase() === alias.toLowerCase() && g.id !== id
  );

  if (aliasConflict) {
    Log.warn(`Alias '${alias}' is already in use by another greenhouse of user ${ownerId}`);
    return { success: false, message: 'Alias already in use by another greenhouse.' };
  }

  const existing = greenhouses.find(g => g.id === id);
  if (!existing) {
    Log.warn(`Greenhouse ${id} not found or not owned by user ${ownerId}`);
    return { success: false, message: 'Greenhouse not found or not authorized.' };
  }

  const updated = await greenhouseModel.updateGreenhouse(id, alias, apitoken);
  Log.ok(`Greenhouse ${id} updated by user ${ownerId}`);
  return { success: true, message: 'Ok', greenhouse: updated.toJSON() };
};


export const deleteGreenhouseByOwner = async (id, ownerId) => {
  Log.info(`User ${ownerId} requested to delete greenhouse ${id}`);

  const deleted = await greenhouseModel.deleteGreenhouseByOwner(id, ownerId);

  if (!deleted) {
    Log.warn(`Failed to delete greenhouse ${id}. It may not exist or not belong to user ${ownerId}`);
    return { success: false, message: 'Greenhouse not found or not authorized.' };
  }

  Log.ok(`Greenhouse ${id} deleted by user ${ownerId}`);
  return { success: true, message: 'Greenhouse deleted successfully.' };
};


export const addIrrigation = async (greenhouseId, isWatered) => {
  Log.info(`Adding irrigation record to greenhouse ${greenhouseId} with value: ${isWatered}`);

  const irrigation = await irrigationModel.createIrrigation(greenhouseId, isWatered);

  Log.ok(`Irrigation recorded for greenhouse ${greenhouseId}`);
  return { success: true, irrigation: irrigation.toJSON() };
};


export const getIrrigation = async (greenhouseId) => {
  Log.info(`Fetching irrigation records for greenhouse ${greenhouseId}`);

  const irrigationList = await irrigationModel.getIrrigationByGreenhouseId(greenhouseId);
  const result = irrigationList.map(i => i.toJSON());

  Log.ok(`Retrieved ${result.length} irrigation records for greenhouse ${greenhouseId}`);
  return { success: true, irrigations: result };
};


export const addDataToGreenhouse = async (greenhouseId, jsonData) => {
  Log.info(`Adding data to greenhouse ${greenhouseId}`);

  const data = await dataModel.createData(greenhouseId, jsonData);

  Log.ok(`Data added to greenhouse ${greenhouseId}`);
  return { success: true, data: data.toJSON() };
};


export const getData = async (greenhouseId) => {
  Log.info(`Fetching data for greenhouse ${greenhouseId}`);

  const dataList = await dataModel.getDataByGreenhouseId(greenhouseId);
  const result = dataList.map(d => d.toJSON());

  Log.ok(`Retrieved ${result.length} data entries for greenhouse ${greenhouseId}`);
  return { success: true, data: result };
};

export const addConfigurationToGreenhouse = async (greenhouseId, configKey, configValue) => {
  Log.info(`Adding new configuration for greenhouse ${greenhouseId} with key: ${configKey}`);

  // Verificar si la configuración con la misma clave ya existe en el invernadero
  const existingConfig = await greenhouseConfigurationModel.getConfigurationsByGreenhouseId(greenhouseId);
  const configExists = existingConfig.some(config => config.configKey.toLowerCase() === configKey.toLowerCase());

  if (configExists) {
    Log.warn(`Configuration key '${configKey}' already exists for greenhouse ${greenhouseId}`);
    return { success: false, message: `Configuration key '${configKey}' already exists.` };
  }

  // Crear la nueva configuración
  const newConfig = await greenhouseConfigurationModel.createConfiguration(greenhouseId, configKey, configValue);

  Log.ok(`Configuration added for greenhouse ${greenhouseId} with key: ${configKey}`);

  return { success: true, configuration: newConfig.toJSON() };
};

export const getConfigurationsForGreenhouse = async (greenhouseId) => {
  Log.info(`Fetching configurations for greenhouse ${greenhouseId}`);

  // Obtener todas las configuraciones asociadas al invernadero
  const configurations = await greenhouseConfigurationModel.getConfigurationsByGreenhouseId(greenhouseId);

  if (!configurations || configurations.length === 0) {
    Log.warn(`No configurations found for greenhouse ${greenhouseId}`);
    return { success: true, configurations: [] };
  }

  const configList = configurations.map(config => config.toJSON());

  Log.ok(`Found ${configList.length} configurations for greenhouse ${greenhouseId}`);

  return { success: true, configurations: configList };
};

export const updateConfiguration = async (id, newConfigKey, newConfigValue) => {
  Log.info(`Updating configuration with id ${id}`);

  // Verificar si la configuración existe y pertenece al invernadero
  const updatedConfig = await greenhouseConfigurationModel.updateConfiguration(id, newConfigKey, newConfigValue);

  if (!updatedConfig) {
    Log.warn(`Configuration with id ${id} not found or update failed`);
    return { success: false, message: 'Configuration update failed.' };
  }

  Log.ok(`Configuration with id ${id} updated successfully`);

  return { success: true, configuration: updatedConfig.toJSON() };
};


export const deleteConfiguration = async (id) => {
  Log.info(`Deleting configuration with id ${id}`);

  // Eliminar la configuración por id
  const result = await greenhouseConfigurationModel.deleteConfiguration(id);

  if (!result) {
    Log.warn(`Configuration with id ${id} not found or deletion failed`);
    return { success: false, message: 'Configuration deletion failed.' };
  }

  Log.ok(`Configuration with id ${id} deleted successfully`);

  return { success: true };
};

export const deleteAllConfigurationsForGreenhouse = async (greenhouseId) => {
  Log.info(`Deleting all configurations for greenhouse ${greenhouseId}`);

  // Eliminar todas las configuraciones asociadas al invernadero
  const result = await greenhouseConfigurationModel.deleteAllConfigurationsByGreenhouse(greenhouseId);

  if (!result) {
    Log.warn(`No configurations found or deletion failed for greenhouse ${greenhouseId}`);
    return { success: false, message: 'Failed to delete all configurations.' };
  }

  Log.ok(`All configurations deleted for greenhouse ${greenhouseId}`);

  return { success: true, message: 'All configurations deleted successfully.' };
};


export const authenticateGreenhouse = async (apitoken) => {
  // Verificar si el apitoken es válido
  const greenhouse = await greenhouseModel.getGreenhouseByApitoken(apitoken);

  if (!greenhouse) {
    Log.warning(`Authentication failed for greenhouse with apitoken ${apitoken}`);
    return { success: false, message: 'Invalid apitoken' };
  }

  const user = await userModel.getUserById(greenhouse.ownerId);

  // Actualizar la última sesión del usuario
  await greenhouseModel.updateLastActiveTimestamp(greenhouse.id);

  return { success: true, message: 'Ok', token: authGreenhouse(greenhouse, user) };
};


export const addGreenhouseData = async (userId, greenhouseId, jsonData) => {
  try {
    // Verificar si el invernadero pertenece al usuario
    const greenhouse = await greenhouseModel.getGreenhouseById(greenhouseId);
    if (!greenhouse || greenhouse.ownerId !== userId) {
      return { success: false, message: 'Unauthorized to add data to this greenhouse' };
    }

    // Crear los datos para el invernadero
    const result = await dataModel.createData(greenhouseId, jsonData);
    if (!result) {
      return { success: false, message: 'Failed to add data to greenhouse' };
    }

    return { success: true, message: 'Data added successfully', data: result };
  } catch (error) {
    return { success: false, message: `Error: ${error.message}` };
  }
};



export const addGreenhouseIrrigation = async (userId, greenhouseId, irrigated) => {
  try {
    // Verificar si el invernadero pertenece al usuario
    const greenhouse = await greenhouseModel.getGreenhouseById(greenhouseId);
    if (!greenhouse || greenhouse.ownerId !== userId) {
      return { success: false, message: 'Unauthorized to add irrigation to this greenhouse' };
    }

    // Crear el registro de irrigación
    const result = await irrigationModel.createIrrigation(greenhouseId, irrigated);
    if (!result) {
      return { success: false, message: 'Failed to add irrigation' };
    }

    return { success: true, message: 'Irrigation added successfully', data: result };
  } catch (error) {
    return { success: false, message: `Error: ${error.message}` };
  }
};