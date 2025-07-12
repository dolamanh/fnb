# FnB - React Native App với Clean Architecture + Redux Toolkit

Ứng dụng React Native được xây dựng theo nguyên tắc Clean Architecture chuẩn Uncle Bob, với WatermelonDB, Dependency Injection, Redux Toolkit và Axios cho RESTful API.

## 🏗️ Clean Architecture Overview

Dự án này tuân thủ nghiêm ngặt nguyên tắc Clean Architecture với **Dependency Rule**: các layer bên trong không được phụ thuộc vào layer bên ngoài.

### 🎯 Core Layer (Business Logic) - Innermost
**Độc lập hoàn toàn, không phụ thuộc framework hay database**
- **Entities**: Business objects thuần túy (`User`, `Cart`)
- **Use Cases**: Business logic với interface đơn giản `IUseCase<TInput, TOutput>`
- **Ports**: Interface contracts cho external dependencies
  - `repositories/`: Repository interfaces
  - `services/`: Service interfaces (`IApiService`, `IDatabaseService`)
  - `datasources/`: DataSource interfaces

### 🔧 Infrastructure Layer (Data & External Concerns)
**Implements ports của Core layer, chứa framework-specific code**
- **API**: External service communication
  - `dtos/`: Data Transfer Objects (Request/Response models)
  - `mappers/`: Convert giữa DTOs và Domain Entities
- **Database**: Data persistence với WatermelonDB
  - `models/`: Database schema models
  - `mappers/`: Convert giữa DB models và Domain Entities
- **Repositories**: Orchestrate remote + local data sources
- **Services**: External service implementations
- **DataSources**: Data access implementations (remote API, local DB)

### 🎨 Presentation Layer (UI & State) - Outermost
**React Native UI components và state management**
- **Screens**: UI screens (`UserListScreen`)
- **Components**: Reusable UI components (`UserItem`, `UserForm`)
- **Models**: View models cho UI display (`UserViewModel`)
- **Mappers**: Convert Domain Entities sang View Models
- **State Management**: Redux Toolkit với typed hooks

### 🔌 Dependency Injection
**Inversify container quản lý dependencies và tuân thủ Dependency Rule**
- **Container**: DI container setup
- **Types**: Symbol definitions cho DI

## 📁 Project Structure

```
src/
├── core/                                    # 🎯 CORE LAYER (Business Logic)
│   ├── entities/                           # Domain entities (thuần túy, không phụ thuộc)
│   │   ├── User.ts                         # User business object
│   │   └── Cart.ts                         # Cart business object
│   ├── ports/                              # Interface contracts (Dependency Inversion)
│   │   ├── repositories/
│   │   │   └── IUserRepository.ts          # Repository interface
│   │   ├── services/
│   │   │   ├── IApiService.ts              # API service interface
│   │   │   └── IDatabaseService.ts         # Database service interface
│   │   └── datasources/
│   │       ├── IUserRemoteDataSource.ts    # Remote data source interface
│   │       └── IUserLocalDataSource.ts     # Local data source interface
│   └── usecases/                           # Business logic use cases
│       ├── base/
│       │   └── IBaseUseCase.ts             # Base UseCase interface
│       └── user/
│           ├── GetUsersUseCase.ts          # Get all users
│           ├── CreateUserUseCase.ts        # Create new user
│           ├── UpdateUserUseCase.ts        # Update existing user
│           └── DeleteUserUseCase.ts        # Delete user
│
├── infrastructure/                         # 🔧 INFRASTRUCTURE LAYER (Framework & External)
│   ├── api/                                # External API communication
│   │   ├── dtos/                           # Data Transfer Objects
│   │   │   ├── UserResponse.ts             # API response models
│   │   │   └── CartResponse.ts
│   │   └── mappers/                        # API ↔ Domain conversion
│   │       ├── UserMapper.ts               # User API/DB/View mappers
│   │       └── CartMapper.ts               # Cart API/DB/View mappers
│   ├── database/                           # Data persistence
│   │   ├── schema.ts                       # WatermelonDB schema
│   │   ├── UserModel.ts                    # Database table models
│   │   └── CartModel.ts
│   ├── repositories/                       # Repository implementations
│   │   └── UserRepository.ts               # Implements IUserRepository
│   ├── services/                           # Service implementations
│   │   ├── ApiService.ts                   # HTTP client implementation
│   │   └── DatabaseService.ts              # Database service implementation
│   └── datasources/                        # Data source implementations
│       ├── UserRemoteDataSource.ts         # API data source
│       └── UserLocalDataSource.ts          # Local database data source
│
├── presentation/                           # 🎨 PRESENTATION LAYER (UI & State)
│   ├── screens/
│   │   └── UserListScreen.tsx              # UI screens
│   ├── components/
│   │   ├── UserItem.tsx                    # Reusable components
│   │   └── UserForm.tsx
│   ├── models/                             # View models for UI
│   │   ├── UserViewModel.ts                # User display model
│   │   └── CartViewModel.ts                # Cart display model
│   └── mappers/
│       └── UserViewMapper.ts               # Domain ↔ View conversion
│
├── store/                                  # 🔄 STATE MANAGEMENT
│   ├── index.ts                            # Redux store configuration
│   ├── hooks.ts                            # Typed Redux hooks
│   └── slices/
│       └── usersSlice.ts                   # User state slice
│
├── di/                                     # 🔌 DEPENDENCY INJECTION
│   ├── container.ts                        # Inversify DI container
│   └── types.ts                            # DI symbols
│
└── utils/                                  # 🛠️ UTILITIES
    ├── CircuitBreaker.ts                   # Resilience patterns
    └── errorHandler.ts                     # Error handling
```
│       └── user/                           # User-specific use cases
│           ├── GetUsersUseCase.ts
│           ├── CreateUserUseCase.ts
│           ├── UpdateUserUseCase.ts
│           └── DeleteUserUseCase.ts
├── data/                                   # Data Management Layer
│   ├── models/
│   │   ├── request/                        # API Request models
│   │   │   └── UserRequest.ts
│   │   ├── response/                       # API Response models
│   │   │   └── UserResponse.ts
│   │   ├── database/                       # Database models
│   │   │   ├── UserModel.ts
│   │   │   └── schema.ts
│   │   └── mappers/                        # Model converters
│   │       └── UserMapper.ts
│   ├── datasources/
│   │   ├── interfaces/                     # DataSource contracts
│   │   │   ├── IUserRemoteDataSource.ts
│   │   │   └── IUserLocalDataSource.ts
│   │   └── implementations/                # DataSource implementations
│   │       ├── UserRemoteDataSource.ts
│   │       └── UserLocalDataSource.ts
│   ├── services/
│   │   ├── interfaces/                     # Service contracts
│   │   │   ├── IApiService.ts
│   │   │   └── IDatabaseService.ts
│   │   └── implementations/                # Service implementations
│   │       ├── ApiService.ts
│   │       └── DatabaseService.ts
│   └── repositories/
│       └── UserRepository.ts               # Repository implementations
├── presentation/                           # UI & State Layer
│   ├── components/
│   │   ├── UserItem.tsx                    # Reusable components
│   │   └── UserForm.tsx
│   ├── screens/
│   │   └── UserListScreen.tsx              # Screen components
│   └── models/
│       └── UserViewModel.ts                # View models for UI
├── store/                                  # State Management
│   ├── index.ts                           # Redux store configuration
│   ├── hooks.ts                           # Typed Redux hooks
│   └── slices/
│       └── usersSlice.ts                  # Redux Toolkit slices
├── di/                                     # Dependency Injection
│   ├── container.ts                       # Inversify container
│   └── types.ts                           # DI symbols
└── utils/
    ├── errorHandler.ts                    # Error handling utilities
    └── CircuitBreaker.ts                  # Circuit breaker pattern
│           ├── UpdateUserUseCase.ts
│           ├── IDeleteUserUseCase.ts
│           └── DeleteUserUseCase.ts
├── data/
│   ├── models/
│   │   ├── UserModel.ts
│   │   └── schema.ts
│   ├── datasources/
│   │   ├── IApiService.ts
│   │   ├── ApiService.ts
│   │   ├── IDatabaseService.ts
│   │   ├── DatabaseService.ts
│   │   ├── IUserRemoteDataSource.ts
│   │   ├── UserRemoteDataSource.ts
│   │   ├── IUserLocalDataSource.ts
│   │   └── UserLocalDataSource.ts
│   └── repositories/
│       └── UserRepository.ts
├── presentation/
│   ├── screens/
│   │   └── UserListScreen.tsx
│   └── components/
│       ├── UserItem.tsx
│       └── UserForm.tsx
├── store/
│   ├── index.ts
│   ├── hooks.ts
│   └── slices/
│       └── usersSlice.ts
├── di/
│   ├── types.ts
│   └── container.ts
├── utils/
│   ├── errorHandler.ts
│   └── CircuitBreaker.ts
├── debug/
│   └── TestDI.ts
└── index.ts
```

## 🚀 Key Features

### 1. **Clean Architecture Compliance**
- **Dependency Rule**: Core không phụ thuộc Infrastructure/Presentation
- **Interface Segregation**: Ports/Adapters pattern với clear contracts
- **Separation of Concerns**: Mỗi layer có trách nhiệm riêng biệt
- **Framework Independence**: Business logic không phụ thuộc React Native
- **Testable**: Dễ dàng unit test với dependency injection

### 2. **Multi-Layer Mappers**
- **API Mappers**: UserApiResponse ↔ User Entity
- **Database Mappers**: UserModel ↔ User Entity  
- **View Mappers**: User Entity ↔ UserViewModel
- **Separation by Concern**: Mỗi mapper thuộc đúng layer của nó

### 3. **Offline-First Architecture**
- **WatermelonDB**: High-performance local database
- **Cache Strategy**: Local-first, fallback to API
- **Optimistic Updates**: Instant UI feedback
- **Background Sync**: Auto-sync khi có network

### 4. **Type-Safe Dependency Injection**
- **Inversify Container**: Manage dependencies centrally
- **Interface-based**: Loose coupling via interfaces
- **Symbol Types**: Type-safe DI symbols
- **Easy Testing**: Mock implementations for unit tests

### 5. **Error Handling & Resilience**
- **Circuit Breaker**: Automatic retry with backoff
- **Global Error Handler**: Centralized error processing
- **Graceful Degradation**: Fallback strategies for failures
- **User-Friendly Messages**: Clear error communication

### 6. **Redux Toolkit Integration**
- **Async Thunks**: Handle side effects elegantly
- **RTK Query Ready**: Scalable for API state management
- **Typed Hooks**: useAppDispatch, useAppSelector
- **DevTools**: Time-travel debugging support

## 🛠️ Tech Stack

**Frontend Framework**
- **React Native**: Cross-platform mobile development
- **TypeScript**: Static type checking và better developer experience

**State Management**  
- **Redux Toolkit**: Modern Redux với reduced boilerplate
- **React Redux**: React bindings với typed hooks

**Data Layer**
- **WatermelonDB**: Reactive local database cho offline-first apps
- **Axios**: HTTP client với interceptors và error handling

**Architecture Patterns**
- **Clean Architecture**: Uncle Bob's architecture principles
- **Dependency Injection**: Inversify container cho IoC
- **Repository Pattern**: Data access abstraction
- **UseCase Pattern**: Business logic encapsulation

**Development Tools**
- **Metro Bundler**: React Native bundler
- **React Native CLI**: Development và build tools
- **TypeScript Compiler**: Type checking và compilation

## 📱 App Features

### 👥 User Management System
- ✅ **Get All Users**: Fetch users từ API với local caching
- ✅ **Create User**: Add new user với validation
- ✅ **Update User**: Edit user information
- ✅ **Delete User**: Remove user với confirmation
- ✅ **Offline Support**: Full CRUD operations work offline
- ✅ **Auto Sync**: Background synchronization với remote API
- ✅ **Pull to Refresh**: Manual refresh functionality
- ✅ **Error Handling**: Graceful error states và user feedback

### 🔄 Data Synchronization
```
📱 Local Database (WatermelonDB) ↔ 🌐 Remote API
   ↓
🔁 Bidirectional sync
   ↓
📊 Redux Store (UI State)
   ↓  
🎨 React Native UI
```

### 🎯 Business Logic Flow
```
1. User interacts với UI component
2. Component dispatches Redux action
3. Async thunk calls appropriate UseCase via DI
4. UseCase executes business logic
5. Repository coordinates local/remote data sources
6. Data flows back through mappers
7. Redux state updates
8. UI re-renders với new data
```

## 🔧 Development Setup

### Prerequisites
```bash
# Node.js (≥16.x)
node --version

# React Native CLI
npm install -g @react-native-community/cli

# iOS (macOS only)
# Install Xcode và Command Line Tools
xcode-select --install

# Android
# Install Android Studio và set ANDROID_HOME
```

### Installation
```bash
# 1. Clone repository
git clone <repository-url>
cd fnb

# 2. Install dependencies
npm install

# 3. iOS setup (macOS only)
cd ios && pod install && cd ..

# 4. Start Metro bundler
npm start

# 5. Run app
# iOS
npm run ios
# Android  
npm run android
```

### Development Commands
```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator/device
npm run android

# Type checking
npx tsc --noEmit

# Reset Metro cache
npm start -- --reset-cache

# Clean builds
# iOS
cd ios && xcodebuild clean && cd ..
# Android
cd android && ./gradlew clean && cd ..
```

## 🧪 Testing Strategy

### Unit Testing
```bash
# Run all tests
npm test

# Run với coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Structure
```
__tests__/
├── core/
│   ├── entities/
│   ├── usecases/
│   └── ports/
├── infrastructure/
│   ├── repositories/
│   ├── services/
│   └── datasources/
└── presentation/
    ├── components/
    └── screens/
```

### Testing Clean Architecture
- **Core Layer**: Test business logic isolation
- **Infrastructure**: Mock external dependencies
- **Presentation**: Test UI components với mocked data
- **Integration**: Test complete user flows

## 🏗️ Adding New Features

### 1. Create Domain Entity
```typescript
// src/core/entities/NewEntity.ts
export interface NewEntity {
  id: string;
  name: string;
  // ...other properties
}
```

### 2. Define Repository Interface
```typescript
// src/core/ports/repositories/INewEntityRepository.ts
export interface INewEntityRepository {
  getAll(): Promise<NewEntity[]>;
  getById(id: string): Promise<NewEntity>;
  create(entity: NewEntity): Promise<NewEntity>;
  update(entity: NewEntity): Promise<NewEntity>;
  delete(id: string): Promise<void>;
}
```

### 3. Create Use Cases
```typescript
// src/core/usecases/newentity/GetNewEntitiesUseCase.ts
export class GetNewEntitiesUseCase implements IUseCase<void, NewEntity[]> {
  constructor(private repository: INewEntityRepository) {}
  
  async execute(): Promise<NewEntity[]> {
    return await this.repository.getAll();
  }
}
```

### 4. Implement Infrastructure
```typescript
// src/infrastructure/repositories/NewEntityRepository.ts
// src/infrastructure/datasources/NewEntityRemoteDataSource.ts
// src/infrastructure/api/dtos/NewEntityResponse.ts
// src/infrastructure/database/NewEntityModel.ts
```

### 5. Add to DI Container
```typescript
// src/di/container.ts
container.bind<INewEntityRepository>(TYPES.NewEntityRepository)
  .to(NewEntityRepository);
```

### 6. Create UI Components
```typescript
// src/presentation/screens/NewEntityListScreen.tsx
// src/presentation/models/NewEntityViewModel.ts
```

## 🚀 Production Deployment

### Build Configuration
```bash
# Android Release
cd android
./gradlew assembleRelease

# iOS Release  
cd ios
xcodebuild -workspace fnb.xcworkspace -scheme fnb -configuration Release
```

### Environment Setup
```bash
# Development
API_BASE_URL=http://localhost:3000/api

# Production
API_BASE_URL=https://api.yourapp.com
```

## 🎯 Best Practices & Conventions

### 🏗️ Clean Architecture Rules
```
✅ DO: Core không import Infrastructure/Presentation  
✅ DO: Infrastructure implement Core interfaces
✅ DO: Presentation chỉ import Core entities và use cases
✅ DO: Sử dụng Dependency Injection cho loose coupling

❌ DON'T: Core import bất kỳ framework nào
❌ DON'T: Infrastructure import Presentation  
❌ DON'T: Direct database/API calls từ UI components
❌ DON'T: Business logic trong UI components
```

### 📝 Naming Conventions
```typescript
// Entities: Singular noun
User, Cart, Order

// Interfaces: I + PascalCase
IUserRepository, IApiService

// Use Cases: Verb + Noun + UseCase
GetUsersUseCase, CreateUserUseCase

// DTOs: Entity + Request/Response
UserApiResponse, CreateUserRequest

// Models: Entity + Model
UserModel, CartModel (database)
UserViewModel, CartViewModel (presentation)

// Mappers: Entity + Layer + Mapper
UserApiMapper, UserDbMapper, UserViewMapper
```

### 🔄 Mapper Responsibilities
```typescript
// API Mapper (Infrastructure): API ↔ Domain
UserApiMapper.fromApiResponse(): UserApiResponse → User
UserApiMapper.toApiRequest(): User → CreateUserRequest

// DB Mapper (Infrastructure): Database ↔ Domain  
UserDbMapper.fromDbModel(): UserModel → User
UserDbMapper.toDbModel(): User → UserModel

// View Mapper (Presentation): Domain ↔ View
UserViewMapper.toViewModel(): User → UserViewModel
UserViewMapper.fromViewModel(): UserViewModel → User
```

## 📈 Performance Optimizations

### 🚀 Offline-First Strategy
- **Local Cache**: WatermelonDB làm primary data source
- **Background Sync**: Sync với API khi có network
- **Optimistic Updates**: UI updates immediately
- **Conflict Resolution**: Last-write-wins strategy

### ⚡ React Native Optimizations  
- **FlatList**: Virtualized lists cho large datasets
- **Memoization**: React.memo cho expensive components
- **Lazy Loading**: Code splitting cho screens
- **Image Caching**: Optimized image loading

## 🐛 Troubleshooting

### Common Issues
```bash
# Metro bundler cache issues
npm start -- --reset-cache

# Android build issues  
cd android && ./gradlew clean && cd ..

# iOS build issues
cd ios && xcodebuild clean && cd ..

# TypeScript errors
npx tsc --noEmit

# Dependency issues
rm -rf node_modules && npm install
```

### Architecture Violations
```bash
# Check dependency direction
npx madge --circular --extensions ts,tsx src/

# Find unused exports  
npx ts-unused-exports tsconfig.json

# Type checking
npx tsc --noEmit --strict
```

## 📚 Further Reading

### Clean Architecture Resources
- [Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)
- [Ports and Adapters Pattern](https://alistair.cockburn.us/hexagonal-architecture/)

### React Native + Clean Architecture
- [React Native Clean Architecture](https://github.com/eduardomoroni/react-native-clean-architecture)
- [Clean Architecture in React](https://blog.cleancoder.com/uncle-bob/2011/11/22/Clean-Architecture.html)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Follow Clean Architecture principles
4. Add comprehensive tests
5. Commit changes (`git commit -m 'Add AmazingFeature'`)
6. Push to branch (`git push origin feature/AmazingFeature`)
7. Open Pull Request

---

**Built with ❤️ using Clean Architecture principles**
// UserRepository.ts
export class UserRepository implements IUserRepository {
  async getAllUsers(): Promise<User[]> {
    // Try cache first, then API
    const cachedUsers = await this.localDataSource.getUsers();
    if (cachedUsers.length > 0) {
      return cachedUsers.map(UserMapper.fromDatabaseModel);
    }
    
    const apiUsers = await this.remoteDataSource.getUsers();
    // Cache for offline access
    await this.localDataSource.saveUsers(apiUsers);
    
    return apiUsers.map(UserMapper.fromApiResponse);
  }
}
```

**5. Data Source (Infrastructure)**
```typescript
// UserRemoteDataSource.ts
export class UserRemoteDataSource implements IUserRemoteDataSource {
  async getUsers(): Promise<UserApiResponse[]> {
    const response = await this.apiService.get<UserApiResponse[]>('/users');
    return response.data;
  }
}
```

**6. UI Update (Presentation)**
```typescript
// UserListScreen.tsx
const users = useAppSelector(state => state.users.data);
const viewModels = users.map(UserViewMapper.toViewModel);

return (
  <FlatList
    data={viewModels}
    renderItem={({ item }) => <UserItem user={item} />}

