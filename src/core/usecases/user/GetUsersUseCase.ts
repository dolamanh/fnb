import { injectable, inject } from 'inversify';
import type { IUserRepository } from '../../ports/repositories/IUserRepository';
import { TYPES } from '../../../di/types';
import { User } from '../../entities/user/User';
import { IUseCase } from '../base/IBaseUseCase';

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
