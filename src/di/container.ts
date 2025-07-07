import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

// Direct imports with types
import { ApiService } from '../data/datasources/ApiService';
import { DatabaseService } from '../data/datasources/DatabaseService';
import { UserRemoteDataSource } from '../data/datasources/UserRemoteDataSource';
import { UserLocalDataSource } from '../data/datasources/UserLocalDataSource';
import { UserRepository } from '../data/repositories/UserRepository';
import { GetUsersUseCase } from '../core/usecases/user/GetUsersUseCase';
import { CreateUserUseCase } from '../core/usecases/user/CreateUserUseCase';
import { UpdateUserUseCase } from '../core/usecases/user/UpdateUserUseCase';
import { DeleteUserUseCase } from '../core/usecases/user/DeleteUserUseCase';
import type { IApiService } from '../data/datasources/IApiService';
import type { IDatabaseService } from '../data/datasources/IDatabaseService';
import type { IUserLocalDataSource } from '../data/datasources/IUserLocalDataSource';
import type { IUserRemoteDataSource } from '../data/datasources/IUserRemoteDataSource';
import type { IUserRepository } from '../core/repositories/IUserRepository';

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

export { container };
