import { injectable, inject } from 'inversify';
import { IDeleteUserUseCase } from './IDeleteUserUseCase';
import type { IUserRepository } from '../../repositories/IUserRepository';
import { TYPES } from '../../../di/types';

@injectable()
export class DeleteUserUseCase implements IDeleteUserUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(id: string): Promise<void> {
    return await this.userRepository.deleteUser(id);
  }
}
