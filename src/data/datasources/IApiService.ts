import { AxiosResponse } from 'axios';

export interface IApiService {
  get<T>(url: string, config?: any): Promise<AxiosResponse<T>>;
  post<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>>;
  put<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>>;
  delete<T>(url: string, config?: any): Promise<AxiosResponse<T>>;
  patch<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>>;
}
