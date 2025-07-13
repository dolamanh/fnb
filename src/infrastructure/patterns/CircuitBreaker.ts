/**
 * Circuit Breaker Pattern Implementation
 * Prevents cascading failures by tracking API call failures
 */

export enum CircuitBreakerState {
  CLOSED = 'CLOSED',     // Normal operation
  OPEN = 'OPEN',         // Circuit is open, calls are blocked
  HALF_OPEN = 'HALF_OPEN' // Testing if service is back
}

export interface CircuitBreakerConfig {
  failureThreshold: number;  // Number of failures before opening circuit
  resetTimeout: number;      // Time before trying to close circuit (ms)
  monitoringWindow: number;  // Time window for failure tracking (ms)
}

export class CircuitBreaker {
  private state: CircuitBreakerState = CircuitBreakerState.CLOSED;
  private failures: number = 0;
  private lastFailureTime: number = 0;
  private nextAttempt: number = 0;
  private config: CircuitBreakerConfig;

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = {
      failureThreshold: 5,
      resetTimeout: 60000, // 1 minute
      monitoringWindow: 120000, // 2 minutes
      ...config
    };
  }

  async call<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();

    // Check if we should reset failure count due to time window
    if (now - this.lastFailureTime > this.config.monitoringWindow) {
      this.failures = 0;
    }

    // Handle different states
    switch (this.state) {
      case CircuitBreakerState.CLOSED:
        return this.executeClosed(fn);
      
      case CircuitBreakerState.OPEN:
        return this.executeOpen(fn, now);
      
      case CircuitBreakerState.HALF_OPEN:
        return this.executeHalfOpen(fn);
      
      default:
        throw new Error('Unknown circuit breaker state');
    }
  }

  private async executeClosed<T>(fn: () => Promise<T>): Promise<T> {
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private async executeOpen<T>(fn: () => Promise<T>, now: number): Promise<T> {
    if (now < this.nextAttempt) {
      throw new Error('Circuit breaker is OPEN - calls are blocked');
    }
    
    // Try to transition to HALF_OPEN
    this.state = CircuitBreakerState.HALF_OPEN;
    return this.executeHalfOpen(fn);
  }

  private async executeHalfOpen<T>(fn: () => Promise<T>): Promise<T> {
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = CircuitBreakerState.CLOSED;
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.config.failureThreshold) {
      this.state = CircuitBreakerState.OPEN;
      this.nextAttempt = Date.now() + this.config.resetTimeout;
    }
  }

  public getState(): CircuitBreakerState {
    return this.state;
  }

  public getFailures(): number {
    return this.failures;
  }

  public reset(): void {
    this.failures = 0;
    this.state = CircuitBreakerState.CLOSED;
    this.lastFailureTime = 0;
    this.nextAttempt = 0;
  }
}
