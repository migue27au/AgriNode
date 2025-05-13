import { findUserByUsername } from '../models/userModel.js';

export const authenticateUser = async (username, password) => {
  const user = await findUserByUsername(username);

  if (!user || user.password !== password) {
    return { success: false, message: 'Invalid credentials' };
  }

  // Aquí podrías generar un JWT real
  return { success: true, token: 'mock-token-123' };
};
