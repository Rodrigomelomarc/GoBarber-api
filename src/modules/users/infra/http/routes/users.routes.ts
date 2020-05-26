import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

const usersRouter = Router();

const upload = multer(uploadConfig);

usersRouter.post('/', UsersController.create);

usersRouter.patch(
  '/',
  ensureAuthenticated,
  upload.single('file'),
  UserAvatarController.update,
);

export default usersRouter;
