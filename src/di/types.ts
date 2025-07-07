export const TYPES = {
  // Data Sources
  UserRemoteDataSource: Symbol.for('UserRemoteDataSource'),
  UserLocalDataSource: Symbol.for('UserLocalDataSource'),
  
  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  
  // Use Cases
  GetUsersUseCase: Symbol.for('GetUsersUseCase'),
  CreateUserUseCase: Symbol.for('CreateUserUseCase'),
  UpdateUserUseCase: Symbol.for('UpdateUserUseCase'),
  DeleteUserUseCase: Symbol.for('DeleteUserUseCase'),
  
  // Services
  ApiService: Symbol.for('ApiService'),
  DatabaseService: Symbol.for('DatabaseService'),
};
