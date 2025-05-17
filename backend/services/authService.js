import * as userModel from '../models/userModel.js';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import Log from '../utils/log.js';

import { authenticateUser as authUser } from '../utils/authentication.js';

// Función para autenticar al usuario y actualizar su sesión
export const authenticateUser = async (username, password) => {
  // Verifica las credenciales del usuario
  const user = await userModel.checkCredentials(username, password);

  // Si no se encuentra el usuario o las credenciales no son correctas
  if (!user) {
    Log.warn(`Authenticating "${username}" failed`);
    return { success: false, message: 'Invalid credentials' };
  }

  // Actualizar la última sesión del usuario
  await userModel.updateLastSession(user.id);

  return { success: true, message: 'Ok', token: authUser(user) };
};

// Función para obtener todos los usuarios (solo accesible por admin)
export const getAllUsers = async (currentUser) => {
  if (currentUser.role !== 'admin') {
    Log.warn(`User "${currentUser.username}" is not authorized to fetch all users`);
    return { success: false, message: 'Unauthorized' };
  }

  const users = await userModel.getAllUsers();

  Log.ok(`Found ${users.length} users`);
  return { success: true, message: 'Ok', users };
};

// Función para actualizar un usuario (solo accesible por admin)
export const updateUser = async (currentUser, userId, newRole) => {
  if (currentUser.role !== 'admin') {
    Log.warn(`User "${currentUser.username}" is not authorized to update users`);
    return { success: false, message: 'Unauthorized' };
  }

  const updatedUser = await userModel.updateRole(userId, newRole);

  if (!updatedUser) {
    Log.warn(`User with id ${userId} not found`);
    return { success: false, message: 'User not found' };
  }

  Log.ok(`User with id ${userId} updated to role "${newRole}"`);
  return { success: true, message: 'Ok', user: updatedUser };
};

// Función para eliminar un usuario (solo accesible por admin)
export const deleteUser = async (currentUser, userId) => {
  if (currentUser.role !== 'admin') {
    Log.warn(`User "${currentUser.username}" is not authorized to delete users`);
    return { success: false, message: 'Unauthorized' };
  }

  const user = await userModel.getUserById(userId);

  if (!user) {
    Log.warn(`User with id ${userId} not found`);
    return { success: false, message: 'User not found' };
  }

  // Eliminar el usuario
  const result = await userModel.deleteUserById(userId);

  if (!result) {
    Log.warn(`Failed to delete user with id ${userId}`);
    return { success: false, message: 'Failed to delete user' };
  }

  Log.ok(`User with id ${userId} deleted successfully`);
  return { success: true, message: 'Ok' };
};


// Función para crear un nuevo usuario (solo accesible por admin)
export const createUser = async (currentUser, username, password, role = 'user') => {
  if (currentUser.role !== 'admin') {
    Log.warn(`User "${currentUser.username}" is not authorized to create users`);
    return { success: false, message: 'Unauthorized' };
  }

  const usernameSanitized = username.trim();

  // Validaciones
  const validUsername = /^[a-zA-Z0-9_-]+$/.test(usernameSanitized);
  if (!validUsername) {
    Log.warn(`Username "${username}" contains invalid characters`);
    return { success: false, message: 'Username contains invalid characters' };
  }

  if (usernameSanitized.length < 5) {
    Log.warn(`Username "${username}" is too short`);
    return { success: false, message: 'Username must be at least 5 characters long' };
  }

  const existingUser = await userModel.getUserByUsername(usernameSanitized);
  if (existingUser) {
    Log.warn(`Username "${usernameSanitized}" is already taken`);
    return { success: false, message: 'Username already exists' };
  }

  try {
    const newUser = await userModel.createUser(usernameSanitized, password, role);
    Log.ok(`User "${usernameSanitized}" created successfully with role "${role}"`);
    return { success: true, message: 'Ok', user: newUser.toJSON() };
  } catch (error) {
    Log.error(`Failed to create user "${usernameSanitized}": ${error.message}`);
    return { success: false, message: 'Failed to create user' };
  }
};



// Función para crear un nuevo usuario (solo accesible por admin)
export const createUserUnrestringed = async (username, password, role = 'user') => {
  const usernameSanitized = username.trim();

  // Validaciones
  const validUsername = /^[a-zA-Z0-9_-]+$/.test(usernameSanitized);
  if (!validUsername) {
    Log.warn(`Username "${username}" contains invalid characters`);
    return { success: false, message: 'Username contains invalid characters' };
  }

  if (usernameSanitized.length < 5) {
    Log.warn(`Username "${username}" is too short`);
    return { success: false, message: 'Username must be at least 5 characters long' };
  }

  const existingUser = await userModel.getUserByUsername(usernameSanitized);
  if (existingUser) {
    Log.warn(`Username "${usernameSanitized}" is already taken`);
    return { success: false, message: 'Username already exists' };
  }

  try {
    const newUser = await userModel.createUser(usernameSanitized, password, role);
    Log.ok(`User "${usernameSanitized}" created successfully with role "${role}"`);
    return { success: true, message: 'Ok', user: newUser.toJSON() };
  } catch (error) {
    Log.error(`Failed to create user "${usernameSanitized}": ${error.message}`);
    return { success: false, message: 'Failed to create user' };
  }
};