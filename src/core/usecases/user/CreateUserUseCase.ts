import { injectable, inject } from 'inversify';
import { ICreateUserUseCase } from './ICreateUserUseCase';
import type { IUserRepository } from '../../repositories/IUserRepository';
import { User } from '../../entities/User';
import { TYPES } from '../../../di/types';

@injectable()
export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return await this.userRepository.createUser(userData);
  }
}
