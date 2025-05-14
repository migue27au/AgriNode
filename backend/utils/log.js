import chalk from 'chalk';

import path from 'path';

class Log {

  // Métodos para logear con el nombre de archivo predefinido
  static ok(message) {
    console.log(`[OK] [${Log.fileName}] ${message}`);
  }

  static db(message) {
    console.log(`[DB] [${Log.fileName}] ${message}`);
  }

  static warning(message) {
    console.log(`[WARNING] [${Log.fileName}] ${message}`);
  }

  static info(message) {
    console.log(`[INFO] [${Log.fileName}] ${message}`);
  }

  static bad(message) {
    console.log(`[BAD] [${Log.fileName}] ${message}`);
  }

  static critical(message) {
    console.log(`[CRITICAL] [${Log.fileName}] ${message}`);
  }
}

export default Log;


