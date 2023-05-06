const express = require('express');
const authRouter = express.Router();

const {
  loginAuthentication,
  register,
  requireAuth,
  changePassword,
  githubLoginAuthentication,
  get,
  me
} = require('../controllers/authController');

authRouter.get('/', get);
authRouter.post('/login/github', githubLoginAuthentication);
authRouter.post('/login', loginAuthentication);
authRouter.post('/register', register);
authRouter.get('/me', requireAuth, me);
authRouter.patch('/password', requireAuth, changePassword);

module.exports = authRouter;