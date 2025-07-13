// Core Domain Error - Business rule violations

import { BaseError } from './BaseError';

export class ValidationError extends BaseError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;

  constructor(message: string, public readonly field?: string, details?: any) {
    super(message, details);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      field: this.field,
      details: this.details,
      statusCode: this.statusCode,
    };
  }
}

export class BusinessRuleError extends BaseError {
  readonly code = 'BUSINESS_RULE_ERROR';
  readonly statusCode = 422;

  constructor(message: string, details?: any) {
    super(message, details);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      statusCode: this.statusCode,
    };
  }
}

export class NotFoundError extends BaseError {
  readonly code = 'NOT_FOUND_ERROR';
  readonly statusCode = 404;

  constructor(resource: string, id?: string, details?: any) {
    const message = id 
      ? `${resource} with id '${id}' not found`
      : `${resource} not found`;
    super(message, details);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      statusCode: this.statusCode,
    };
  }
}

export class UnauthorizedError extends BaseError {
  readonly code = 'UNAUTHORIZED_ERROR';
  readonly statusCode = 401;

  constructor(message = 'Unauthorized access', details?: any) {
    super(message, details);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      statusCode: this.statusCode,
    };
  }
}
