import Log from '../utils/log.js';

import * as greenhouseService from '../services/greenhouseService.js';

import { verifyUserToken, verifyGreenhouseToken } from '../utils/authentication.js';

export const createGreenhouse = async (req, res) => {
  const verifiedToken = verifyUserToken(req.headers.authorization);
  if (!verifiedToken.success) {
    return res.status(verifiedToken.status).json(verifiedToken);
  }

  const user = verifiedToken.user;
  const { alias } = req.body;
  if (!alias) {
    return res.status(400).json({ status: 400, error: 'Bad Request', message: 'alias are required' });
  }
  
  try {
    const result = await greenhouseService.newGreenhouse(user.id, alias);

    if (!result.success) {
      return res.status(400).json({
        status: 400,
        error: 'Error',
        message: result.message,
        data: {}
      });
    }

    res.status(201).json({
      status: 201,
      error: '',
      message: 'Greenhouse created successfully',
      data: result.greenhouse
    });

  } catch (err) {
    Log.bad(`Error creating greenhouse: ${err.message}`);
    Log.bad(err.stack);
    res.status(500).json({ status: 500, error: 'Internal Server Error', message: err.message });
  }
};


export const getGreenhousesByOwner = async (req, res) => {
  const verifiedToken = verifyUserToken(req.headers.authorization);
  if (!verifiedToken.success) {
    return res.status(verifiedToken.status).json(verifiedToken);
  }

  const user = verifiedToken.user;

  try {
    const result = await greenhouseService.getGreenhousesByOwnerId(user.id);

    res.status(200).json({
      status: 200,
      error: '',
      message: 'Greenhouses fetched successfully',
      data: result
    });
  } catch (err) {
    Log.bad(`Error fetching greenhouses: ${err.message}`);
    Log.bad(err.stack);
    res.status(500).json({ status: 500, error: 'Internal Server Error', message: err.message });
  }
};


export const updateGreenhouse = async (req, res) => {
  const verifiedToken = verifyUserToken(req.headers.authorization);
  if (!verifiedToken.success) {
    return res.status(verifiedToken.status).json(verifiedToken);
  }

  const user = verifiedToken.user;
  const { id } = req.params;
  const { alias } = req.body;

  if (!alias) {
    return res.status(400).json({ status: 400, error: 'Bad Request', message: 'Alias is required' });
  }

  try {
    const result = await greenhouseService.updateGreenhouseByOwnerId(user.id, id, alias);

    if (!result.success) {
      return res.status(404).json({
        status: 404,
        error: 'Not Found',
        message: result.message,
        data: {}
      });
    }

    res.status(200).json({
      status: 200,
      error: '',
      message: 'Greenhouse updated successfully',
      data: result.greenhouse
    });

  } catch (err) {
    Log.bad(`Error updating greenhouse: ${err.message}`);
    Log.bad(err.stack);
    res.status(500).json({ status: 500, error: 'Internal Server Error', message: err.message });
  }
};


export const deleteGreenhouse = async (req, res) => {
  const verifiedToken = verifyUserToken(req.headers.authorization);
  if (!verifiedToken.success) {
    return res.status(verifiedToken.status).json(verifiedToken);
  }

  const user = verifiedToken.user;
  const { id } = req.params;

  try {
    const result = await greenhouseService.deleteGreenhouseByOwner(user.id, id);

    if (!result.success) {
      return res.status(404).json({
        status: 404,
        error: 'Not Found',
        message: result.message,
        data: {}
      });
    }

    res.status(200).json({
      status: 200,
      error: '',
      message: 'Greenhouse deleted successfully',
      data: {}
    });

  } catch (err) {
    Log.bad(`Error deleting greenhouse: ${err.message}`);
    Log.bad(err.stack);
    res.status(500).json({ status: 500, error: 'Internal Server Error', message: err.message });
  }
};


export const authenticateGreenhouse = async (req, res) => {
  const { apitoken } = req.body;
  const result = await greenhouseService.authenticateGreenhouse(apitoken);

  if (!result.success) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
      message: result.message,
      data: {}
    });
  }

  res.json({
    status: 200,
    error: '',
    message: 'Login successful',
    data: { token: result.token }
  });
};



// Ruta para agregar datos al invernadero
export const createGreenhouseData = async (req, res) => {
  const verifiedToken = verifyGreenhouseToken(req.headers.authorization);
  if (!verifiedToken.success) {
    return res.status(verifiedToken.status).json(verifiedToken);
  }

  const greenhouse = verifiedToken.greenhouse;

  const { jsonData } = req.body; // El JSON con los datos que se van a guardar

  // Llamamos al servicio para agregar los datos al invernadero
  const result = await greenhouseService.addGreenhouseData(greenhouse.user.id, greenhouse.id, jsonData);
  
  // Verificamos el resultado y respondemos con el estado adecuado
  if (!result.success) {
    return res.status(400).json({
      status: 400,
      error: 'Error',
      message: result.message,
      data: {}
    });
  }

  res.status(201).json({
    status: 201,
    error: '',
    message: 'Data added successfully',
    data: result.data // Retornamos los datos agregados
  });
};


// Ruta para agregar irrigación al invernadero
export const createGreenhouseIrrigation = async (req, res) => {
  const verifiedToken = verifyGreenhouseToken(req.headers.authorization);
  if (!verifiedToken.success) {
    return res.status(verifiedToken.status).json(verifiedToken);
  }

  const greenhouse = verifiedToken.greenhouse;

  const { irrigated } = req.body; // Si el invernadero fue regado o no (true/false)
  
  // Llamamos al servicio para agregar el registro de irrigación
  const result = await greenhouseService.addGreenhouseIrrigation(greenhouse.user.id, greenhouse.id, irrigated);
  
  // Verificamos el resultado y respondemos con el estado adecuado
  if (!result.success) {
    return res.status(400).json({
      status: 400,
      error: 'Error',
      message: result.message,
      data: {}
    });
  }

  res.status(201).json({
    status: 201,
    error: '',
    message: 'Irrigation added successfully',
    data: result.data // Retornamos los datos de irrigación agregados
  });
};