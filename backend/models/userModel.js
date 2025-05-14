import db from '../config/db.js';
import bcrypt from 'bcryptjs';  // Importamos bcryptjs para manejar las contraseñas

import Log from '../utils/log.js';


class User {
  constructor(id, username, password, lastSession, role) {
    this.id = id;
    this.username = username;
    this.password = password;  // Contraseña hasheada
    this.lastSession = lastSession;
    this.role = role;  // Rol del usuario
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      lastSession: this.lastSession,
      role: this.role
    };
  }

  // Método para comparar una contraseña con la almacenada en la base de datos
  async comparePassword(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;  // Devuelve true o false
  }
}

// Método para actualizar la contraseña del usuario
export const updatePassword = async (userId, newPassword) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Actualizamos la contraseña en la base de datos
    const result = await db.query(
      'UPDATE users SET password = $1 WHERE id = $2 RETURNING id, username, password, last_session, role',
      [hashedPassword, userId]
    );
    
    return result.rows[0];  // Devuelve el usuario con la nueva contraseña
  }

  // Método para actualizar el rol de un usuario
export const updateRole = async (userId, newRole) => {
    const result = await db.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, password, last_session, role',
      [newRole, userId]
    );

    return result.rows[0];  // Devuelve el usuario con el nuevo rol
  }

export const checkCredentials = async (username, password) => {
  const user = await getUserByUsername(username);

  if (!user) return null;

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (passwordMatch) {
    return user;
  }

  return null;
};


// Método para obtener un usuario por su correo electrónico
export const getUserByUsername = async (username) => {
  const result = await db.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );

  if (result.rows.length === 0) {
    return null;  // Si no hay usuario, devuelve null
  }

  const userData = result.rows[0];
  // Devolver el objeto User con los datos recuperados de la base de datos
  return new User(
    userData.id, 
    userData.username, 
    userData.password, 
    userData.last_session,
    userData.role  // Añadir el rol del usuario
  );
};

// Método para obtener un usuario por su ID
export const getUserById = async (id) => {
  const result = await db.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    return null;  // Si no hay usuario, devuelve null
  }

  const userData = result.rows[0];
  return new User(
    userData.id, 
    userData.username, 
    userData.password, 
    userData.last_session,
    userData.role  // Añadir el rol del usuario
  );
};

// Método para crear un nuevo usuario en la base de datos
export const createUser = async (username, password, role = 'user') => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await db.query(
    'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, password, last_session, role',
    [username, hashedPassword, role]
  );

  const userData = result.rows[0];
  return new User(
    userData.id, 
    userData.username, 
    userData.password, 
    userData.last_session,
    userData.role  // Añadir el rol del usuario
  );
};

export default User;
