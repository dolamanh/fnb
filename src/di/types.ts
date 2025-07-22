export const TYPES = {
  // Data Sources
  UserRemoteDataSource: Symbol.for('UserRemoteDataSource'),
  UserLocalDataSource: Symbol.for('UserLocalDataSource'),
  CartRemoteDataSource: Symbol.for('CartRemoteDataSource'),
  
  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  CartRepository: Symbol.for('CartRepository'),
  
  // Use Cases
  GetUsersUseCase: Symbol.for('GetUsersUseCase'),
  CreateUserUseCase: Symbol.for('CreateUserUseCase'),
  UpdateUserUseCase: Symbol.for('UpdateUserUseCase'),
  DeleteUserUseCase: Symbol.for('DeleteUserUseCase'),

  GetCartsUseCase: Symbol.for('GetCartsUseCase'),
  WebSocketUseCases: Symbol.for('WebSocketUseCases'),
  
  // Services
  ApiService: Symbol.for('ApiService'),
  DatabaseService: Symbol.for('DatabaseService'),
  WebSocketService: Symbol.for('WebSocketService'),
};
