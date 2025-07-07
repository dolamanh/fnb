import { injectable, inject } from 'inversify';
import { IGetUsersUseCase } from './IGetUsersUseCase';
import type { IUserRepository } from '../../repositories/IUserRepository';
import { User } from '../../entities/User';
import { TYPES } from '../../../di/types';

@injectable()
export class GetUsersUseCase implements IGetUsersUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(): Promise<User[]> {
    try {
      // First try to sync with remote API
      await this.userRepository.syncUsers();
      return await this.userRepository.getUsers();
    } catch (error) {
      // If sync fails, return local data
      console.warn('Failed to sync users, returning local data:', error);
      return await this.userRepository.getUsers();
    }
  }
}
