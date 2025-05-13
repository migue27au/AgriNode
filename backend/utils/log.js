import chalk from 'chalk';

import path from 'path';

class Log {
  // Atributo estático para almacenar el nombre del archivo
  static fileName;

  // Constructor para establecer el nombre del archivo
  constructor(currentFile) {
    Log.fileName = path.basename(currentFile); // Guardamos el nombre del archivo
  }

  // Métodos para logear con el nombre de archivo predefinido
  ok(message) {
    console.log(`[OK] [${Log.fileName}] ${message}`);
  }

  db(message) {
    console.log(`[DB] [${Log.fileName}] ${message}`);
  }

  warning(message) {
    console.log(`[WARNING] [${Log.fileName}] ${message}`);
  }

  info(message) {
    console.log(`[INFO] [${Log.fileName}] ${message}`);
  }

  bad(message) {
    console.log(`[BAD] [${Log.fileName}] ${message}`);
  }

  critical(message) {
    console.log(`[CRITICAL] [${Log.fileName}] ${message}`);
  }
}

export default Log;


