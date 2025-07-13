// Infrastructure Layer Error Handling - Utility functions for handling framework errors

import { BaseError } from '../../core/errors/BaseError';
import { ApiError, NetworkError, DatabaseError, TimeoutError } from './InfrastructureErrors';

export interface ErrorLogger {
  error(message: string, error?: any): void;
  warn(message: string, details?: any): void;
  info(message: string, details?: any): void;
}

export class ErrorHandler {
  constructor(private logger: ErrorLogger) {}

  handleApiError(error: any): BaseError {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      const message = data?.message || `API Error: ${status}`;
      this.logger.error(`API Error ${status}:`, { message, data });
      return new ApiError(message, status, data);
    }
    
    if (error.request) {
      // Network error
      this.logger.error('Network Error:', error.message);
      return new NetworkError('Network connection failed');
    }
    
    if (error.code === 'ECONNABORTED') {
      // Timeout error
      this.logger.error('Timeout Error:', error.message);
      return new TimeoutError();
    }
    
    // Unknown error
    this.logger.error('Unknown API Error:', error.message);
    return new ApiError(error.message || 'Unknown error occurred', 500);
  }

  handleDatabaseError(error: any): BaseError {
    this.logger.error('Database Error:', error.message);
    return new DatabaseError(error.message || 'Database operation failed');
  }

  logError(error: BaseError | Error, context?: string): void {
    const prefix = context ? `[${context}]` : '';
    
    if (error instanceof BaseError) {
      this.logger.error(`${prefix} ${error.code}:`, {
        message: error.message,
        details: error.details,
        ...(error as any).toJSON?.(),
      });
    } else {
      this.logger.error(`${prefix} Unexpected Error:`, {
        message: error.message,
        stack: error.stack,
      });
    }
  }

  createLogger(): ErrorLogger {
    return {
      error: (message: string, error?: any) => {
        console.error(message, error);
      },
      warn: (message: string, details?: any) => {
        console.warn(message, details);
      },
      info: (message: string, details?: any) => {
        console.info(message, details);
      },
    };
  }
}

// Global error handler instance
export const errorHandler = new ErrorHandler({
  error: (message: string, error?: any) => console.error(message, error),
  warn: (message: string, details?: any) => console.warn(message, details),
  info: (message: string, details?: any) => console.info(message, details),
});

// Legacy functions for backward compatibility
export const handleApiError = (error: any): BaseError => errorHandler.handleApiError(error);
export const logError = (error: BaseError | Error, context?: string): void => errorHandler.logError(error, context);
