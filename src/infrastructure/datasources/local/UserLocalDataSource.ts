import { injectable, inject } from 'inversify';
import type { IUserLocalDataSource } from '../../../core/ports/datasources/local/IUserLocalDataSource';
import type { IDatabaseService } from '../../../core/ports/services/IDatabaseService';
import { User } from '../../../core/entities/user/User';
import { UserModel } from '../../database/UserModel';
import { UserMapper } from '../../api/mappers/UserMapper';
import { TYPES } from '../../../di/types';
import { Q } from '@nozbe/watermelondb';

@injectable()
export class UserLocalDataSource implements IUserLocalDataSource {
  constructor(
    @inject(TYPES.DatabaseService) private databaseService: IDatabaseService
  ) {}

  async getUsers(): Promise<User[]> {
    const database = this.databaseService.getDatabase();
    const userModels = await database.get<UserModel>('users').query().fetch();
    return UserMapper.fromDatabaseModelArray(userModels);
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const database = this.databaseService.getDatabase();
      const userModel = await database.get<UserModel>('users').find(id);
      return UserMapper.fromDatabaseModel(userModel);
    } catch (error) {
      return null;
    }
  }

  async createUser(user: User): Promise<User> {
    const database = this.databaseService.getDatabase();
    
    const newUser = await database.write(async () => {
      return await database.get<UserModel>('users').create(userModel => {
        userModel.name = user.name;
        userModel.email = user.email;
        userModel.phone = user.phone;
        userModel.avatar = user.avatar;
        userModel.isActive = user.isActive;
        userModel.createdAt = user.createdAt;
        userModel.updatedAt = user.updatedAt;
      });
    });

    return UserMapper.fromDatabaseModel(newUser);
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const database = this.databaseService.getDatabase();
    
    const updatedUser = await database.write(async () => {
      const userModel = await database.get<UserModel>('users').find(id);
      return await userModel.update(user => {
        if (userData.name !== undefined) user.name = userData.name;
        if (userData.email !== undefined) user.email = userData.email;
        if (userData.phone !== undefined) user.phone = userData.phone;
        if (userData.avatar !== undefined) user.avatar = userData.avatar;
        if (userData.isActive !== undefined) user.isActive = userData.isActive;
        user.updatedAt = new Date();
      });
    });

    return UserMapper.fromDatabaseModel(updatedUser);
  }

  async deleteUser(id: string): Promise<void> {
    const database = this.databaseService.getDatabase();
    
    await database.write(async () => {
      const userModel = await database.get<UserModel>('users').find(id);
      await userModel.destroyPermanently();
    });
  }

  async saveUsers(users: User[]): Promise<void> {
    const database = this.databaseService.getDatabase();
    
    await database.write(async () => {
      // Get existing users to check for duplicates
      const existingUsers = await database.get<UserModel>('users').query().fetch();
      const existingIds = new Set(existingUsers.map(u => u.id));
      
      const usersToCreate = users.filter(user => !existingIds.has(user.id));
      
      if (usersToCreate.length > 0) {
        const newUsers = usersToCreate.map(user => {
          return database.get<UserModel>('users').prepareCreate(userModel => {
            userModel._raw.id = user.id; // Set the ID explicitly
            userModel.name = user.name;
            userModel.email = user.email;
            userModel.phone = user.phone;
            userModel.avatar = user.avatar;
            userModel.isActive = user.isActive;
            userModel.createdAt = user.createdAt;
            userModel.updatedAt = user.updatedAt;
          });
        });
        
        await database.batch(...newUsers);
      }
    });
  }

  async clearUsers(): Promise<void> {
    const database = this.databaseService.getDatabase();
    
    await database.write(async () => {
      const allUsers = await database.get<UserModel>('users').query().fetch();
      await database.batch(
        ...allUsers.map(user => user.prepareDestroyPermanently())
      );
    });
  }
}
