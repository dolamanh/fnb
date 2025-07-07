import { injectable, inject } from 'inversify';
import { IUpdateUserUseCase } from './IUpdateUserUseCase';
import type { IUserRepository } from '../../repositories/IUserRepository';
import { User } from '../../entities/User';
import { TYPES } from '../../../di/types';

@injectable()
export class UpdateUserUseCase implements IUpdateUserUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(id: string, userData: Partial<User>): Promise<User> {
    return await this.userRepository.updateUser(id, userData);
  }
}
