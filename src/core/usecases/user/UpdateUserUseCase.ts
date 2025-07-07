import { injectable, inject } from 'inversify';
import { IUseCase } from '../base/IBaseUseCase';
import { User } from '../../entities/User';
import type { IUserRepository } from '../../repositories/IUserRepository';
import { TYPES } from '../../../di/types';

// Simple types inline
type UpdateUserInput = { id: string; userData: Partial<User> };
type UpdateUserOutput = User;

@injectable()
export class UpdateUserUseCase implements IUseCase<UpdateUserInput, UpdateUserOutput> {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
    // Simple validation
    if (!input.id || input.id.trim().length === 0) {
      throw new Error('User ID is required');
    }
    
    if (!input.userData || Object.keys(input.userData).length === 0) {
      throw new Error('User data to update is required');
    }
    
    // Validate email if provided
    if (input.userData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.userData.email)) {
        throw new Error('Invalid email format');
      }
    }
    
    // Validate name if provided
    if (input.userData.name && input.userData.name.trim().length === 0) {
      throw new Error('User name cannot be empty');
    }

    // Business logic
    return await this.userRepository.updateUser(input.id, input.userData);
  }
}
