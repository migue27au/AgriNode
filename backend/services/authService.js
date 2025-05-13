import { getUserByUsername, checkCredentials } from '../models/userModel.js';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import Log from '../utils/log.js';
import { fileURLToPath } from 'url';
const log = new Log(fileURLToPath(import.meta.url));

const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta';


export const authenticateUser = async (username, password) => {
  // Verifica las credenciales del usuario
  const user = await checkCredentials(username, password);

  // Si no se encuentra el usuario o las credenciales no son correctas
  if (!user) {
    log.warning(`Authenticating "${username}" failed`);
    return { success: false, message: 'Invalid credentials' };
  }

  log.ok(`Authenticating "${user.username}" success`);

  const jwtPayload = {
    userId: user.id,
    username: user.username,
    role: user.role,
  };

  const jwtOptions = {
    expiresIn: '1h',  // El token expirará en una hora
  };

  const token = jwt.sign(jwtPayload, JWT_SECRET, jwtOptions);

  return { success: true, token };
};