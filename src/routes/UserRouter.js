/* eslint-disable linebreak-style */
/* eslint-disable new-cap */
import {Router} from 'express';
import {userDetails} from '../controllers/UserController.js';
import auth from '../middleware/Auth.js';
import roleCheck from '../middleware/RoleCheck.js';

const userRouter = Router();

userRouter.get('/details', auth, roleCheck(['admin']), userDetails);

export default userRouter;
