import { User } from '../../entities/User';

export interface IUpdateUserUseCase {
  execute(id: string, userData: Partial<User>): Promise<User>;
}
