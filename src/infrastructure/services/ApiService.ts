import { injectable } from 'inversify';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { IApiService } from '../../core/ports/services/IApiService';
import { handleApiError, logError } from '../../utils/errorHandler';

@injectable()
export class ApiService implements IApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'ttps://fnb-dev.mysapo.vn/admin', // Example API
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'X-Device-Id': 'fe3eff481b8edaf3',
        'X-Fnb-Token': 'e3533728c17144b1a5463866c593dab3'
      },
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log('API Request:', config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log('API Response:', response.status, response.config.url);
        return response;
      },
      (error) => {
        const apiError = handleApiError(error);
        logError(apiError, 'ApiService.interceptor');
        return Promise.reject(apiError);
      }
    );
  }

  async get<T>(url: string, config?: any): Promise<AxiosResponse<T>> {
    try {
      return await this.axiosInstance.get<T>(url, config);
    } catch (error) {
      const apiError = handleApiError(error);
      logError(apiError, `ApiService.get(${url})`);
      throw apiError;
    }
  }

  async post<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    try {
      return await this.axiosInstance.post<T>(url, data, config);
    } catch (error) {
      const apiError = handleApiError(error);
      logError(apiError, `ApiService.post(${url})`);
      throw apiError;
    }
  }

  async put<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    try {
      return await this.axiosInstance.put<T>(url, data, config);
    } catch (error) {
      const apiError = handleApiError(error);
      logError(apiError, `ApiService.put(${url})`);
      throw apiError;
    }
  }

  async delete<T>(url: string, config?: any): Promise<AxiosResponse<T>> {
    try {
      return await this.axiosInstance.delete<T>(url, config);
    } catch (error) {
      const apiError = handleApiError(error);
      logError(apiError, `ApiService.delete(${url})`);
      throw apiError;
    }
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    try {
      return await this.axiosInstance.patch<T>(url, data, config);
    } catch (error) {
      const apiError = handleApiError(error);
      logError(apiError, `ApiService.patch(${url})`);
      throw apiError;
    }
  }
}
