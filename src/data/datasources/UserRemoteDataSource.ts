import { injectable, inject } from 'inversify';
import type { IUserRemoteDataSource } from './IUserRemoteDataSource';
import type { IApiService } from './IApiService';
import { User } from '../../core/entities/User';
import { TYPES } from '../../di/types';
import { handleApiError, logError } from '../../utils/errorHandler';

interface UserApiResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  website?: string;
}

@injectable()
export class UserRemoteDataSource implements IUserRemoteDataSource {
  constructor(
    @inject(TYPES.ApiService) private apiService: IApiService
  ) {}

  async getUsers(): Promise<User[]> {
    try {
      const response = await this.apiService.get<UserApiResponse[]>('/users');
      return response.data.map(this.mapApiResponseToUser);
    } catch (error) {
      const apiError = handleApiError(error);
      logError(apiError, 'UserRemoteDataSource.getUsers');
      throw apiError;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const response = await this.apiService.get<UserApiResponse>(`/users/${id}`);
      return this.mapApiResponseToUser(response.data);
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
      return this.mapApiResponseToUser(response.data);
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
      return this.mapApiResponseToUser(response.data);
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

  private mapApiResponseToUser(apiUser: UserApiResponse): User {
    try {
      if (!apiUser || !apiUser.id || !apiUser.name || !apiUser.email) {
        throw new Error('Invalid user data from API');
      }
      
      return {
        id: apiUser.id.toString(),
        name: apiUser.name,
        email: apiUser.email,
        phone: apiUser.phone || '',
        avatar: undefined,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      logError(error as Error, 'UserRemoteDataSource.mapApiResponseToUser');
      throw error;
    }
  }
}
