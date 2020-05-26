import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUsersService';

class UsersController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, password, email } = request.body;

    const createUsersService = container.resolve(CreateUserService);

    const user = await createUsersService.execute({
      name,
      password,
      email,
    });

    return response.json(user);
  }
}

export default new UsersController();
