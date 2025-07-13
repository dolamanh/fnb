import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

// Infrastructure implementations
import { ApiService } from '../infrastructure/services/ApiService';
import { DatabaseService } from '../infrastructure/services/DatabaseService';
import { UserRemoteDataSource } from '../infrastructure/datasources/UserRemoteDataSource';
import { UserLocalDataSource } from '../infrastructure/datasources/UserLocalDataSource';
import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { CartRemoteDataSource } from '../infrastructure/datasources/CartRemoteDataSource';

// Core ports
import type { IApiService } from '../core/ports/services/IApiService';
import type { IDatabaseService } from '../core/ports/services/IDatabaseService';
import type { IUserLocalDataSource } from '../core/ports/datasources/IUserLocalDataSource';
import type { IUserRemoteDataSource } from '../core/ports/datasources/IUserRemoteDataSource';
import type { IUserRepository } from '../core/ports/repositories/IUserRepository';

// UseCases
import { GetUsersUseCase } from '../core/usecases/user/GetUsersUseCase';
import { CreateUserUseCase } from '../core/usecases/user/CreateUserUseCase';
import { UpdateUserUseCase } from '../core/usecases/user/UpdateUserUseCase';
import { DeleteUserUseCase } from '../core/usecases/user/DeleteUserUseCase';
import { ICartRemoteDataSource } from '../core/ports/datasources/ICartRemoteDataSource';
import { CartRepository } from '../infrastructure/repositories/CartRepository';
import { ICartRepository } from '../core/ports/repositories/ICartRepository';
import { GetCartsUseCase } from '../core/usecases/user/GetCartsUseCase';


const container = new Container();

// Use factory pattern to avoid decorator metadata issues
container.bind(TYPES.ApiService).toDynamicValue(() => {
  return new ApiService();
}).inSingletonScope();

container.bind(TYPES.DatabaseService).toDynamicValue(() => {
  return new DatabaseService();
}).inSingletonScope();

container.bind(TYPES.UserRemoteDataSource).toDynamicValue(() => {
  const apiService = container.get<IApiService>(TYPES.ApiService);
  return new UserRemoteDataSource(apiService);
});

container.bind(TYPES.UserLocalDataSource).toDynamicValue(() => {
  const databaseService = container.get<IDatabaseService>(TYPES.DatabaseService);
  return new UserLocalDataSource(databaseService);
});

container.bind(TYPES.UserRepository).toDynamicValue(() => {
  const localDataSource = container.get<IUserLocalDataSource>(TYPES.UserLocalDataSource);
  const remoteDataSource = container.get<IUserRemoteDataSource>(TYPES.UserRemoteDataSource);
  return new UserRepository(localDataSource, remoteDataSource);
});

container.bind(TYPES.CartRemoteDataSource).toDynamicValue(() => {
  const apiService = container.get<IApiService>(TYPES.ApiService);
  return new CartRemoteDataSource(apiService);
});

container.bind(TYPES.CartRepository).toDynamicValue(() => {
  const remoteDataSource = container.get<ICartRemoteDataSource>(TYPES.CartRemoteDataSource);
  return new CartRepository(remoteDataSource);
});

// Use Cases - đơn giản hóa, không cần type complex
container.bind(TYPES.GetUsersUseCase).toDynamicValue(() => {
  const userRepository = container.get<IUserRepository>(TYPES.UserRepository);
  return new GetUsersUseCase(userRepository);
});

container.bind(TYPES.CreateUserUseCase).toDynamicValue(() => {
  const userRepository = container.get<IUserRepository>(TYPES.UserRepository);
  return new CreateUserUseCase(userRepository);
});

container.bind(TYPES.UpdateUserUseCase).toDynamicValue(() => {
  const userRepository = container.get<IUserRepository>(TYPES.UserRepository);
  return new UpdateUserUseCase(userRepository);
});

container.bind(TYPES.DeleteUserUseCase).toDynamicValue(() => {
  const userRepository = container.get<IUserRepository>(TYPES.UserRepository);
  return new DeleteUserUseCase(userRepository);
});

container.bind(TYPES.GetCartsUseCase).toDynamicValue(() => {
  const cartRepository = container.get<ICartRepository>(TYPES.CartRepository);
  return new GetCartsUseCase(cartRepository);
});

export { container };
