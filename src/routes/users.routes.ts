import { Router } from 'express';

import CreateUserService from '../services/CreateUsersService';

const usersRouter = Router();

usersRouter.post('/', async (request, response) => {
  try {
    const { name, password, email } = request.body;

    const createUsersService = new CreateUserService();

    const user = await createUsersService.execute({
      name,
      password,
      email,
    });

    return response.json(user);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default usersRouter;
