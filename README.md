# FnB - React Native App với Clean Architecture + Redux Toolkit

Ứng dụng React Native được xây dựng với Clean Architecture, WatermelonDB, Dependency Injection, Redux Toolkit và Axios cho RESTful API.

## 🏗️ Architecture Overview

Dự án này tuân theo nguyên tắc Clean Architecture với cấu trúc package được tối ưu hóa cho việc phân tách rõ ràng interface và implementation:

### Core Layer (Business Logic)
- **Entities**: Business objects của ứng dụng (`User`, `Cart`)
- **Use Cases**: Business logic với interface đơn giản `IUseCase<TInput, TOutput>`
- **Repository Interfaces**: Contracts cho data access

### Data Layer (Data Management)
- **Models**:
  - `request/`: API request models
  - `response/`: API response models  
  - `database/`: WatermelonDB models
  - `mappers/`: Convert giữa các model types
- **DataSources**: 
  - `interfaces/`: Interface definitions
  - `implementations/`: Concrete implementations
- **Services**:
  - `interfaces/`: Service contracts (`IApiService`, `IDatabaseService`)
  - `implementations/`: Service implementations (`ApiService`, `DatabaseService`)
- **Repository Implementations**: Kết hợp remote và local data sources

### Presentation Layer (UI & State)
- **Screens**: UI screens (`UserListScreen`)
- **Components**: Reusable UI components (`UserItem`, `UserForm`)
- **Models**: View models cho UI display (`UserViewModel`)
- **State Management**: Redux Toolkit với typed hooks

### Dependency Injection
- **Container**: Inversify container với phân tách rõ ràng dependencies
- **Types**: Symbol definitions cho DI

## 📁 Project Structure

```
src/
├── core/                                    # Business Logic Layer
│   ├── entities/
│   │   ├── User.ts                         # Domain entities
│   │   └── Cart.ts
│   ├── repositories/
│   │   └── IUserRepository.ts              # Repository contracts
│   └── usecases/
│       ├── base/
│       │   └── IBaseUseCase.ts             # Simplified UseCase interface
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

### 1. Clean Architecture + Package Structure
- **Separation of concerns**: Mỗi layer có trách nhiệm riêng biệt
- **Dependency inversion**: Phụ thuộc vào interface, không phụ thuộc vào implementation
- **Package separation**: Interface và implementation được tách riêng rõ ràng
- **Testable code**: Dễ dàng mock và test từng component
- **Independent**: Không phụ thuộc vào frameworks và UI cụ thể

### 2. Model Layer Architecture
- **Request Models**: Structured data cho API requests
- **Response Models**: Typed responses từ API
- **Database Models**: WatermelonDB entities
- **Domain Entities**: Business logic objects
- **View Models**: UI-optimized data với formatting logic
- **Mappers**: Convert data giữa các layers

### 3. WatermelonDB Integration
- **Offline-first**: Local database với WatermelonDB
- **Reactive queries**: Real-time UI updates
- **Optimistic updates**: Instant UI feedback
- **Sync capabilities**: Tự động sync với remote API

### 4. Dependency Injection với Inversify
- **Container-based**: Manage dependencies centrally
- **Interface-based**: Loose coupling between components
- **Type-safe**: Full TypeScript support
- **Testable**: Easy mocking cho unit tests

### 5. RESTful API Integration
- **Axios HTTP client**: Robust API communication
- **Interceptors**: Request/Response processing
- **Error handling**: Comprehensive error management
- **Circuit breaker**: Automatic retry logic

### 6. Redux Toolkit State Management
- **Centralized State**: Single source of truth
- **Predictable Updates**: Immutable state updates với Immer
- **Async Thunks**: Handle async operations elegantly
- **Type Safety**: Full TypeScript support
- **DevTools**: Redux DevTools integration

### 7. Simplified UseCase Pattern
- **Single Interface**: `IUseCase<TInput, TOutput>`
- **Inline Validation**: No complex base classes
- **Easy to Implement**: Straightforward business logic
- **Type-Safe**: Strong typing for inputs and outputs

## 🛠️ Technologies Used

- **React Native**: Cross-platform mobile framework
- **TypeScript**: Static type checking
- **Redux Toolkit**: Modern Redux với less boilerplate
- **React Redux**: React bindings for Redux
- **WatermelonDB**: High-performance local database
- **Axios**: Promise-based HTTP client
- **Inversify**: Lightweight dependency injection
- **React Hooks**: Modern React patterns

## 📱 Features

### User Management
- ✅ List all users
- ✅ Create new user
- ✅ Update user information
- ✅ Delete user
- ✅ Offline support
- ✅ Auto-sync với API
- ✅ Pull to refresh
- ✅ Error handling

### Data Flow
1. **UI Action**: User tương tác với UI component
2. **Redux Action**: Component dispatch Redux action (async thunk)
3. **Business Logic**: Async thunk gọi Use Cases thông qua DI
4. **Data Access**: Use Cases gọi Repository
5. **API/DB**: Repository gọi Remote/Local Data Sources
6. **State Update**: Redux state được update
7. **UI Re-render**: Components re-render với state mới

### Redux Flow
```
UI Component → dispatch(action) → Redux Store → Async Thunk → Use Cases → Repository → Data Sources → API/DB
                                     ↓
UI Re-render ← Updated State ← Redux Store ← Fulfilled Action ← Response Data
```

## 🔧 Setup và Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd fnb
```

2. **Install dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Configure Android SDK** (nếu cần)
```bash
# Tạo local.properties file
echo "sdk.dir=C:\\Users\\ADMIN\\AppData\\Local\\Android\\Sdk" > android/local.properties
```

4. **iOS setup** (nếu develop cho iOS)
```bash
cd ios && pod install && cd ..
```

5. **Start Metro Bundler**
```bash
npm start
```

6. **Run the app**
```bash
# Android
npm run android
# or using batch script
./run-android.bat

# iOS
npm run ios
```

## 🏗️ Architecture Layers Deep Dive

### 1. **Presentation Layer**
- **Components**: Reusable UI components (`UserItem`, `UserForm`)
- **Screens**: Screen components với navigation (`UserListScreen`)
- **ViewModels**: UI-optimized data models với formatting logic
- **Redux Integration**: Store connection qua typed hooks

### 2. **State Management Layer**
- **Redux Store**: Centralized application state
- **Slices**: Redux Toolkit slices với async thunks
- **Typed Hooks**: Type-safe Redux hooks (`useAppDispatch`, `useAppSelector`)
- **Middleware**: Redux middleware cho async operations

### 3. **Business Logic Layer**
- **Use Cases**: Business rules với simplified `IUseCase<TInput, TOutput>`
- **Entities**: Core business objects (`User`, `Cart`)
- **Validation**: Inline validation logic trong use cases
- Được gọi từ Redux async thunks
- Independent từ UI và data sources

### 4. **Data Layer**
- **Repository Pattern**: Abstract data access layer
- **DataSources**: Remote (API) và Local (WatermelonDB) data sources
- **Models**: Separated request, response, database, và domain models
- **Mappers**: Convert data between different model types

### 5. **Service Layer**
- **API Service**: HTTP client với interceptors
- **Database Service**: WatermelonDB management
- **Error Handling**: Centralized error management
- **Circuit Breaker**: Automatic retry và fallback logic

### 6. **Dependency Injection Layer**
- **Inversify Container**: Manage dependencies centrally
- **Interface-based**: Loose coupling between layers
- **Type-safe**: Full TypeScript support

## 🏛️ Package Structure Benefits

### **Interface/Implementation Separation**
```typescript
// Clear separation allows easy extension
src/data/services/
├── interfaces/
│   ├── IApiService.ts        // Contract
│   └── IDatabaseService.ts   // Contract
└── implementations/
    ├── ApiService.ts         // Implementation
    └── DatabaseService.ts    // Implementation
```

### **Model Layer Architecture**
```typescript
// Data flows through different model types
API Response → Response Model → Domain Entity → View Model → UI
API Request  ← Request Model  ← Domain Entity ← View Model ← UI
Database     ← Database Model ← Domain Entity (via Mapper)
```

### **Mapper Pattern Benefits**
- **Centralized Conversion**: All data transformation logic in one place
- **Type Safety**: Compile-time checking for data conversion
- **Maintainable**: Easy to update when API/Database schema changes
- **Testable**: Easy to test conversion logic

## 🧪 Testing Strategy

Với Clean Architecture và package structure này, testing trở nên dễ dàng:

### **Unit Tests**
- **Use Cases**: Test business logic isolation
- **Mappers**: Test data conversion logic
- **Repository**: Test data access patterns

### **Integration Tests**
- **DataSources**: Test API và database interactions
- **Services**: Test service layer integration

### **UI Tests**
- **Components**: Test React components với mock data
- **Redux**: Test store, reducers, actions, async thunks

## 🔄 Data Flow Architecture

```
UI (Redux) → UseCase → Repository → DataSource → API/Database
    ↓           ↓         ↓          ↓
 ViewModel → Domain → Repository → Mapper → Response/Request Models
```

### **Offline-First Approach**
1. **Local First**: All operations hit local database first
2. **Background Sync**: Sync với remote API ở background
3. **Conflict Resolution**: Handle conflicts khi sync data
4. **Retry Logic**: Circuit breaker pattern cho network failures

## 🎯 SOLID Principles Implementation

1. **Single Responsibility**: Mỗi class/interface có một responsibility
2. **Open/Closed**: Easy to extend via interfaces, closed for modification
3. **Liskov Substitution**: Implementations có thể substitute interfaces
4. **Interface Segregation**: Small, focused interfaces
5. **Dependency Inversion**: Depend on abstractions, not concretions

## 🚀 Future Enhancements

- [ ] Authentication & Authorization layer
- [ ] Real-time updates với WebSocket
- [ ] Image upload functionality
- [ ] Push notifications
- [ ] Offline sync conflict resolution UI
- [ ] Multi-language support
- [ ] Dark mode theme
## 📚 Additional Documentation

Để hiểu rõ hơn về kiến trúc và implementation, tham khảo các tài liệu sau:

- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Chi tiết về Clean Architecture implementation
- **[FLOW_DOCUMENTATION.md](./FLOW_DOCUMENTATION.md)**: Luồng xử lý data và business logic
- **[SIMPLIFIED_USECASE_ARCHITECTURE.md](./SIMPLIFIED_USECASE_ARCHITECTURE.md)**: UseCase pattern đơn giản hóa
- **[ULTRA_SIMPLE_USECASE.md](./ULTRA_SIMPLE_USECASE.md)**: Hướng dẫn implement UseCase

## 📝 Development Notes

### **State Management**
- Sử dụng Redux Toolkit thay vì custom hooks
- Async operations được handle bằng createAsyncThunk
- Type-safe với TypeScript và RTK Query potential

### **Data Layer**
- API endpoint: Hiện tại sử dụng JSONPlaceholder cho demo
- Database: WatermelonDB tự động tạo khi app khởi động
- Mappers: Centralized data conversion logic

### **Architecture**
- Dependencies được inject qua Inversify container
- Interface/Implementation separation cho tất cả services
- Package structure optimized cho scalability

### **Development Tools**
- Redux DevTools enabled trong development mode
- TypeScript strict mode cho type safety
- ESLint và Prettier cho code quality

### **Production Considerations**
- Cần cấu hình real API endpoint
- Environment variables cho different environments
- Error tracking và monitoring
- Performance optimization

---

**Built with ❤️ using Clean Architecture + Redux Toolkit**

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request
