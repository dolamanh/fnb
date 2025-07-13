// Infrastructure Layer Errors - Framework and external service errors

import { BaseError } from '../../core/errors/BaseError';

export class ApiError extends BaseError {
  readonly code = 'API_ERROR';
  public response?: any;

  constructor(
    message: string, 
    public readonly statusCode: number, 
    response?: any, 
    details?: any
  ) {
    super(message, details);
    this.response = response;
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      response: this.response,
      details: this.details,
    };
  }
}

export class NetworkError extends BaseError {
  readonly code = 'NETWORK_ERROR';
  readonly statusCode = 503;

  constructor(message = 'Network connection failed', details?: any) {
    super(message, details);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

export class DatabaseError extends BaseError {
  readonly code = 'DATABASE_ERROR';
  readonly statusCode = 500;

  constructor(message: string, details?: any) {
    super(message, details);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

export class TimeoutError extends BaseError {
  readonly code = 'TIMEOUT_ERROR';
  readonly statusCode = 408;

  constructor(message = 'Request timeout', details?: any) {
    super(message, details);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}
