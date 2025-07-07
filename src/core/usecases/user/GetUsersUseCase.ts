import { injectable, inject } from 'inversify';
import { IUseCase } from '../base/IBaseUseCase';
import { User } from '../../entities/User';
import type { IUserRepository } from '../../repositories/IUserRepository';
import { TYPES } from '../../../di/types';

// Simple types inline
type GetUsersInput = void;
type GetUsersOutput = User[];

@injectable()
export class GetUsersUseCase implements IUseCase<GetUsersInput, GetUsersOutput> {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(): Promise<GetUsersOutput> {
    try {
      return await this.userRepository.getUsers();
    } catch (error) {
      console.error('Failed to get users:', error);
      throw error;
    }
  }
}
