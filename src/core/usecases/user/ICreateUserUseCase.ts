import { User } from '../../entities/User';

export interface ICreateUserUseCase {
  execute(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
}
