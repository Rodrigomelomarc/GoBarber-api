import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';
import CreateUserService from '../services/CreateUsersService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import UpdateuserAvatarService from '../services/UpdateUserAvatarService';

const usersRouter = Router();

const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const { name, password, email } = request.body;

  const createUsersService = new CreateUserService();

  const user = await createUsersService.execute({
    name,
    password,
    email,
  });

  return response.json(user);
});

usersRouter.patch(
  '/',
  ensureAuthenticated,
  upload.single('file'),
  async (request, response) => {
    const updateUserAvatar = new UpdateuserAvatarService();

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFileName: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  },
);

export default usersRouter;
