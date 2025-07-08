// API Response Models for User operations

export interface UserApiResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  username?: string;
  website?: string;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface UsersApiResponse {
  data: UserApiResponse[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateUserApiResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface UpdateUserApiResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  updatedAt: string;
}

export interface DeleteUserApiResponse {
  success: boolean;
  message?: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}
