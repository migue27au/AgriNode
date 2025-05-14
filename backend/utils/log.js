import chalk from 'chalk';

import path from 'path';

class Log {

  // Métodos para logear con el nombre de archivo predefinido
  static ok(message) {
    console.log(`[OK] ${message}`);
  }

  static db(message) {
    console.log(`[DB] ${message}`);
  }

  static warn(message) {
    console.log(`[WARNING] ${message}`);
  }

  static info(message) {
    console.log(`[INFO] ${message}`);
  }

  static bad(message) {
    console.log(`[BAD] ${message}`);
  }

  static critical(message) {
    console.log(`[CRITICAL] ${message}`);
  }
}

export default Log;


