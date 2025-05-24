import jwt from 'jsonwebtoken';
const { JsonWebTokenError, TokenExpiredError } = jwt;

import Log from '../utils/log.js';


const JWT_SECRET_USER = process.env.JWT_SECRET_USER || 'mi_clave_secreta';
const JWT_SECRET_GREENHOUSE = process.env.JWT_SECRET_GREENHOUSE || 'mi_clave_secreta';


export const verifyUserToken = (req) => {
	// Intentamos obtener el token de la cabecera Authorization
	let token = null;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
		token = req.headers.authorization.split(' ')[1];
	}

	Log.ok(req.cookies);
	// Si no está en header, intentamos obtenerlo de la cookie 'token'
	if (!token && req.cookies && req.cookies.token) {
		token = req.cookies.token;
	}

	if (!token) {
		Log.warn(`JWT not provided`);
		return { success: false, status: 401, error: 'Unauthorized', message: 'JWT not provided' };
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET_USER);
		Log.ok(`User ${decoded.username} [${decoded.role}] authenticated`);
		return { success: true, message: 'Ok', user: decoded };

	} catch (err) {
		if (err instanceof TokenExpiredError) {
			Log.warn(`JWT expired`);
			return { success: false, status: 401, error: 'TokenExpired', message: 'JWT has expired' };
		} else if (err instanceof JsonWebTokenError) {
			Log.warn(`JWT invalid`);
			return { success: false, status: 401, error: 'InvalidToken', message: 'JWT is invalid' };
		} else {
			Log.bad("Unknown JWT error");
			Log.bad(err.stack);
			return { success: false, status: 500, error: 'AuthenticationError', message: 'Unknown JWT error' };
		}
	}
};


export const authenticateUser = (user) => {
	Log.ok(`Authenticating "${user.username}" success`);

	const jwtPayload = {
		id: user.id,
		username: user.username,
		role: user.role
	};

	const jwtOptions = {
		expiresIn: '1h',	// El token expirará en una hora
	};

	return jwt.sign(jwtPayload, JWT_SECRET_USER, jwtOptions);
}


//------------------------------------------------------------


export const verifyGreenhouseToken = (authHeader) => {
	const token = authHeader?.split(' ')[1];
	if (!token) {
		return { success: false, status: 401, error: 'Unauthorized', message: 'Token not provided' };
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET_GREENHOUSE);
		Log.ok(`Greenhouse ${decoded.alias} from user ${decoded.user.username} authenticated`)
		return { success: true, message: 'Ok', greenhouse: decoded };

	} catch (err) {
		if (err instanceof TokenExpiredError) {
			return { success: false, status: 401, error: 'TokenExpired', message: 'JWT has expired' };
		} else if (err instanceof JsonWebTokenError) {
			return { success: false, status: 401, error: 'InvalidToken', message: 'JWT is invalid' };
		} else {
			Log.bad(err.stack);
			return { success: false, status: 500, error: 'AuthenticationError', message: 'Unknown JWT error' };
		}
	}
};

export const authenticateGreenhouse = (greenhouse, user) => {
	Log.ok(`Authenticating "${user.username}" success`);

	const jwtPayload = {
		id: greenhouse.id,
		alias: greenhouse.alias,
		user: {
			id: user.id,
			username: user.username,
			role: user.role
		}
	};

	const jwtOptions = {
		expiresIn: '1h',	// El token expirará en una hora
	};

	return jwt.sign(jwtPayload, JWT_SECRET_USER, jwtOptions);
}