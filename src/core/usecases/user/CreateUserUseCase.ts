import { injectable, inject } from 'inversify';
import type { IUserRepository } from '../../ports/repositories/IUserRepository';
import { TYPES } from '../../../di/types';
import { User } from '../../entities/user/User';
import { IUseCase } from '../base/IBaseUseCase';

// Simple types inline
type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
type CreateUserOutput = User;

@injectable()
export class CreateUserUseCase implements IUseCase<CreateUserInput, CreateUserOutput> {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(userData: CreateUserInput): Promise<CreateUserOutput> {
    // Simple validation
    if (!userData.name || userData.name.trim().length === 0) {
      throw new Error('User name is required');
    }
    
    if (!userData.email || userData.email.trim().length === 0) {
      throw new Error('User email is required');
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    // Business logic
    return await this.userRepository.createUser(userData);
  }
}
