import { injectable, inject } from 'inversify';
import type { IUserRepository } from '../../core/ports/repositories/IUserRepository';
import type { IUserRemoteDataSource } from '../../core/ports/datasources/remote/IUserRemoteDataSource';
import type { IUserLocalDataSource } from '../../core/ports/datasources/local/IUserLocalDataSource';
import { User } from '../../core/entities/user/User';
import { TYPES } from '../../di/types';

@injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @inject(TYPES.UserLocalDataSource) private localDataSource: IUserLocalDataSource,
    @inject(TYPES.UserRemoteDataSource) private remoteDataSource: IUserRemoteDataSource
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.localDataSource.getUsers();
  }

  async getUserById(id: string): Promise<User | null> {
    // Try local first, then remote if not found
    let user = await this.localDataSource.getUserById(id);
    if (!user) {
      user = await this.remoteDataSource.getUserById(id);
      if (user) {
        await this.localDataSource.createUser(user);
      }
    }
    return user;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      // Create on remote first
      const remoteUser = await this.remoteDataSource.createUser(userData);
      // Then save to local
      await this.localDataSource.createUser(remoteUser);
      return remoteUser;
    } catch (error) {
      // If remote fails, create locally with generated ID
      const localUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return await this.localDataSource.createUser(localUser);
    }
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    try {
      // Update remote first
      const updatedUser = await this.remoteDataSource.updateUser(id, userData);
      // Then update local
      await this.localDataSource.updateUser(id, updatedUser);
      return updatedUser;
    } catch (error) {
      // If remote fails, update locally
      return await this.localDataSource.updateUser(id, {
        ...userData,
        updatedAt: new Date(),
      });
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      // Delete from remote first
      await this.remoteDataSource.deleteUser(id);
    } catch (error) {
      console.warn('Failed to delete user from remote:', error);
    }
    // Always delete from local
    await this.localDataSource.deleteUser(id);
  }

  async syncUsers(): Promise<void> {
    try {
      const remoteUsers = await this.remoteDataSource.getUsers();
      // Clear existing users first
      await this.localDataSource.clearUsers();
      // Save new users from remote
      // await this.localDataSource.saveUsers(remoteUsers);
      console.log('Users synced successfully');
    } catch (error) {
      console.error('Failed to sync users:', error);
      throw error;
    }
  }
}
