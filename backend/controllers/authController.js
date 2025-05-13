import { authenticateUser } from '../services/authService.js';

export const login = async (req, res) => {
  const { username, password } = req.body;
  const result = await authenticateUser(username, password);

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
