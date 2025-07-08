// Mappers to convert between different model types

import { User } from '../../../core/entities/User';
import { UserApiResponse } from '../response/UserResponse';
import { UserModel } from '../database/UserModel';
import { UserViewModel } from '../../../presentation/models/UserViewModel';

export class UserMapper {
  // API Response -> Domain Entity
  static fromApiResponse(apiResponse: UserApiResponse): User {
    return {
      id: apiResponse.id.toString(),
      name: apiResponse.name,
      email: apiResponse.email,
      phone: apiResponse.phone || '',
      avatar: undefined,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // Domain Entity -> API Response
  static toApiResponse(user: User): UserApiResponse {
    return {
      id: parseInt(user.id),
      name: user.name,
      email: user.email,
      phone: user.phone || '',
    };
  }

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

  // Domain Entity -> View Model
  static toViewModel(user: User): UserViewModel {
    const formatDate = (date: Date): string => {
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    };

    const getInitials = (name: string): string => {
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    const getContactInfo = (email: string, phone?: string): string => {
      if (phone) {
        return `${email} • ${phone}`;
      }
      return email;
    };

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      avatar: user.avatar,
      isActive: user.isActive,
      displayName: user.name,
      contactInfo: getContactInfo(user.email, user.phone),
      statusText: user.isActive ? 'Hoạt động' : 'Không hoạt động',
      statusColor: user.isActive ? '#4CAF50' : '#F44336',
      initials: getInitials(user.name),
      createdAtFormatted: formatDate(user.createdAt),
      updatedAtFormatted: formatDate(user.updatedAt),
    };
  }

  // View Model -> Domain Entity
  static fromViewModel(viewModel: UserViewModel): User {
    return {
      id: viewModel.id,
      name: viewModel.name,
      email: viewModel.email,
      phone: viewModel.phone,
      avatar: viewModel.avatar,
      isActive: viewModel.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // Array mappers
  static fromApiResponseArray(apiResponses: UserApiResponse[]): User[] {
    return apiResponses.map(this.fromApiResponse);
  }

  static fromDatabaseModelArray(dbModels: UserModel[]): User[] {
    return dbModels.map(this.fromDatabaseModel);
  }

  static toViewModelArray(users: User[]): UserViewModel[] {
    return users.map(this.toViewModel);
  }
}
