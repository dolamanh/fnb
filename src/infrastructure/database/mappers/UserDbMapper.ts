// Database-specific mapper: Database Models ↔ Domain Entities

import { User } from '../../../core/entities/User';
import { UserModel } from '../UserModel';

export class UserDbMapper {
  // Database Model -> Domain Entity
  static fromDatabaseModel(dbModel: UserModel): User {
    return {
      id: dbModel.id,
      name: dbModel.name,
      email: dbModel.email,
      phone: dbModel.phone,
      avatar: dbModel.avatar,
      isActive: dbModel.isActive,
      createdAt: dbModel.createdAt,
      updatedAt: dbModel.updatedAt,
    };
  }

  // Domain Entity -> Database Model (for updates)
  static toDatabaseModel(user: User): Partial<UserModel> {
    return {
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      isActive: user.isActive,
      updatedAt: user.updatedAt,
    };
  }

  // Array mappers
  static fromDatabaseModelArray(dbModels: UserModel[]): User[] {
    return dbModels.map(this.fromDatabaseModel);
  }

  static toDatabaseModelArray(users: User[]): Partial<UserModel>[] {
    return users.map(this.toDatabaseModel);
  }
}
