import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  it('should be able to create a new avatar to user', async () => {
    const userRepository = new FakeUserRepository();
    const StorageProvider = new FakeStorageProvider();
    const avatarService = new UpdateUserAvatarService(
      userRepository,
      StorageProvider,
    );

    const user = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@teste.com',
      password: '123456',
    });

    await avatarService.execute({
      avatarFileName: 'jujuba-de-morango.jpg',
      user_id: user.id,
    });

    expect(user.avatar).toBe('jujuba-de-morango.jpg');
  });

  it('should not be able to update avatar from a non existing user', async () => {
    const userRepository = new FakeUserRepository();
    const StorageProvider = new FakeStorageProvider();
    const avatarService = new UpdateUserAvatarService(
      userRepository,
      StorageProvider,
    );

    expect(
      avatarService.execute({
        avatarFileName: 'jujuba-de-morango.jpg',
        user_id: 'non existing user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete old avatar when updating new one', async () => {
    const userRepository = new FakeUserRepository();
    const storageProvider = new FakeStorageProvider();
    const avatarService = new UpdateUserAvatarService(
      userRepository,
      storageProvider,
    );

    const deleteFile = jest.spyOn(storageProvider, 'deleteFile');

    const user = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@teste.com',
      password: '123456',
    });

    await avatarService.execute({
      avatarFileName: 'jujuba-de-morango.jpg',
      user_id: user.id,
    });

    await avatarService.execute({
      avatarFileName: 'jujuba-de-uva.jpg',
      user_id: user.id,
    });

    expect(deleteFile).toHaveBeenCalledWith('jujuba-de-morango.jpg');
    expect(user.avatar).toBe('jujuba-de-uva.jpg');
  });
});
