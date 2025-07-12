import { container } from '../di/container';
import { TYPES } from '../di/types';
import type { IUserLocalDataSource } from '../core/ports/datasources/IUserLocalDataSource';

export function testDI() {
  try {
    console.log('Testing DI container...');
    
    // Test getting UserLocalDataSource
    const localDataSource = container.get<IUserLocalDataSource>(TYPES.UserLocalDataSource);
    console.log('UserLocalDataSource instance:', localDataSource);
    console.log('saveUsers method exists:', typeof localDataSource.saveUsers);
    console.log('saveUsers method:', localDataSource.saveUsers);
    
    // List all methods
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(localDataSource));
    console.log('Available methods:', methods);
    
    return localDataSource;
  } catch (error) {
    console.error('DI Test Error:', error);
    return null;
  }
}
