/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable new-cap */
import {Router} from 'express';
import {login, refreshToken, register, logout} from '../controllers/AuthController.js';

const authRouter = Router();

authRouter.post('/register-admin', async (req, res) => {
  await register(['admin'], req, res);
});
authRouter.post('/register-user', async (req, res) => {
  await register(['user'], req, res);
});
authRouter.post('/login', login);
authRouter.post('/refresh-token', refreshToken);
authRouter.delete('/logout', logout);

export default authRouter;


