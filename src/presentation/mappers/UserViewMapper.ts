// Presentation-specific mapper: Domain Entities ↔ View Models

import { User } from '../../core/entities/User';
import { UserViewModel } from '../models/UserViewModel';

export class UserViewMapper {
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
  static toViewModelArray(users: User[]): UserViewModel[] {
    return users.map(this.toViewModel);
  }

  static fromViewModelArray(viewModels: UserViewModel[]): User[] {
    return viewModels.map(this.fromViewModel);
  }
}
