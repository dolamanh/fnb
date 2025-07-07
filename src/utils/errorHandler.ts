export class ApiError extends Error {
  public statusCode?: number;
  public response?: any;

  constructor(message: string, statusCode?: number, response?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const handleApiError = (error: any): Error => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    const message = data?.message || error.message || 'API Error';
    return new ApiError(message, status, data);
  } else if (error.request) {
    // Network error
    return new NetworkError('Network error: Please check your internet connection');
  } else {
    // Other error
    return new Error(error.message || 'Unknown error occurred');
  }
};

export const logError = (error: Error, context?: string): void => {
  const timestamp = new Date().toISOString();
  const contextMsg = context ? `[${context}] ` : '';
  
  console.error(`${timestamp} ${contextMsg}${error.name}: ${error.message}`);
  
  if (error instanceof ApiError) {
    console.error(`Status Code: ${error.statusCode}`);
    console.error(`Response:`, error.response);
  }
  
  if (error.stack) {
    console.error(`Stack:`, error.stack);
  }
};
