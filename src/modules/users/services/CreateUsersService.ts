import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  name: string;
  password: string;
  email: string;
}

@injectable()
class CreateUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('BCryptHashProvider')
    private hashprovider: IHashProvider,
  ) {}

  public async execute({ name, password, email }: IRequest): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already used!');
    }

    const hashedPassword = await this.hashprovider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      password: hashedPassword,
      email,
    });

    return user;
  }
}

export default CreateUsersService;
