import AppError from '@shared/errors/AppError';

import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUsersService';

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const userRepository = new FakeUserRepository();
    const hashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(userRepository, hashProvider);
    const authenticate = new AuthenticateUserService(
      userRepository,
      hashProvider,
    );

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@teste.com',
      password: '123456',
    });

    const response = await authenticate.execute({
      email: 'johndoe@teste.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate an user with invalid password', async () => {
    const userRepository = new FakeUserRepository();
    const hashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(userRepository, hashProvider);
    const authenticate = new AuthenticateUserService(
      userRepository,
      hashProvider,
    );

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@teste.com',
      password: '123456',
    });

    expect(
      authenticate.execute({
        email: 'johndoe@teste.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate an user with invalid email', async () => {
    const userRepository = new FakeUserRepository();
    const hashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(userRepository, hashProvider);
    const authenticate = new AuthenticateUserService(
      userRepository,
      hashProvider,
    );

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@teste.com',
      password: '123456',
    });

    expect(
      authenticate.execute({
        email: 'fulano@teste.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
