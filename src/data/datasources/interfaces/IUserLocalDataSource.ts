import { User } from '../../../core/entities/User';

export interface IUserLocalDataSource {
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
  saveUsers(users: User[]): Promise<void>;
  clearUsers(): Promise<void>;
}
