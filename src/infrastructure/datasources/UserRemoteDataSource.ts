import { injectable, inject } from 'inversify';
import type { IUserRemoteDataSource } from '../../core/ports/datasources/IUserRemoteDataSource';
import type { IApiService } from '../../core/ports/services/IApiService';
import { User } from '../../core/entities/User';
import { UserApiResponse } from '../api/dtos/UserResponse';
import { UserMapper } from '../api/mappers/UserMapper';
import { TYPES } from '../../di/types';
import { handleApiError, logError } from '../../utils/errorHandler';

@injectable()
export class UserRemoteDataSource implements IUserRemoteDataSource {
  constructor(
    @inject(TYPES.ApiService) private apiService: IApiService
  ) {}

  async getUsers(): Promise<User[]> {
    try {
      const response = await this.apiService.get<UserApiResponse[]>('/users');
      return UserMapper.fromApiResponseArray(response.data);
    } catch (error) {
      const apiError = handleApiError(error);
      logError(apiError, 'UserRemoteDataSource.getUsers');
      throw apiError;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const response = await this.apiService.get<UserApiResponse>(`/users/${id}`);
      return UserMapper.fromApiResponse(response.data);
    } catch (error) {
      const apiError = handleApiError(error);
      logError(apiError, `UserRemoteDataSource.getUserById(${id})`);
      return null;
    }
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const apiData = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
      };
      
      const response = await this.apiService.post<UserApiResponse>('/users', apiData);
      return UserMapper.fromApiResponse(response.data);
    } catch (error) {
      const apiError = handleApiError(error);
      logError(apiError, 'UserRemoteDataSource.createUser');
      throw apiError;
    }
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    try {
      const apiData = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
      };
      
      const response = await this.apiService.put<UserApiResponse>(`/users/${id}`, apiData);
      return UserMapper.fromApiResponse(response.data);
    } catch (error) {
      const apiError = handleApiError(error);
      logError(apiError, `UserRemoteDataSource.updateUser(${id})`);
      throw apiError;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.apiService.delete(`/users/${id}`);
    } catch (error) {
      const apiError = handleApiError(error);
      logError(apiError, `UserRemoteDataSource.deleteUser(${id})`);
      throw apiError;
    }
  }
}
