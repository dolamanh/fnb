import { injectable, inject } from 'inversify';
import type { IUserRepository } from '../../ports/repositories/IUserRepository';
import { TYPES } from '../../../di/types';
import { IUseCase } from '../base/IBaseUseCase';

// Simple types inline
type DeleteUserInput = string; // User ID
type DeleteUserOutput = void;

@injectable()
export class DeleteUserUseCase implements IUseCase<DeleteUserInput, DeleteUserOutput> {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(id: DeleteUserInput): Promise<DeleteUserOutput> {
    // Simple validation
    if (!id || id.trim().length === 0) {
      throw new Error('User ID is required');
    }

    // Business logic
    await this.userRepository.deleteUser(id);
  }
}
