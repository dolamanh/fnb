import { User } from '../../entities/User';

export interface IGetUsersUseCase {
  execute(): Promise<User[]>;
}
