import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUsersService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const userRepository = new FakeUserRepository();
    const hashProvider = new FakeHashProvider();
    const userService = new CreateUserService(userRepository, hashProvider);

    const user = await userService.execute({
      name: 'John Doe',
      email: 'johndoe@teste.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create two users with same email', async () => {
    const userRepository = new FakeUserRepository();
    const hashProvider = new FakeHashProvider();
    const userService = new CreateUserService(userRepository, hashProvider);

    await userService.execute({
      email: 'fulano@teste.com',
      name: 'fulano de tal',
      password: '123456',
    });

    expect(
      userService.execute({
        email: 'fulano@teste.com',
        name: 'fulano de tal',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
