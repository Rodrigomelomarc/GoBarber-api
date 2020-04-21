import User from '../models/User';
import { hash } from 'bcryptjs';
import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';

interface Request {
  name: string;
  password: string;
  email: string;
}

class CreateUsersService {
  public async execute({ name, password, email }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUserExists = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new AppError('Email address already used!');
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      password: hashedPassword,
      email,
    });

    await usersRepository.save(user);

    delete user.password;

    return user;
  }
}

export default CreateUsersService;
