import * as greenhouseModel from '../models/greenhouseModel.js';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import Log from '../utils/log.js';

export const newGreenhouse = async (ownerId, alias) => {
  
    const apitoken = crypto.randomBytes(8).toString('hex').toUpperCase();

    Log.ok(`Creating new greenhouse with alias: ${alias} by user ${ownerId}`);
    const greenhouseCreated = await greenhouseModel.createGreenhouse(ownerId, alias, apitoken);

    Log.ok(`Greenhouse created: ${greenhouseCreated.alias} by user ${ownerId}`);
    
    return { success: true, greenhouse: greenhouseCreated.toJSON() };  
};

