# FnB - React Native App với Clean Architecture + Redux Toolkit

Ứng dụng React Native được xây dựng với Clean Architecture, WatermelonDB, Dependency Injection, Redux Toolkit và Axios cho RESTful API.

## 🏗️ Architecture Overview

Dự án này tuân theo nguyên tắc Clean Architecture với các layer sau:

### Core Layer
- **Entities**: Business objects của ứng dụng (`User`)
- **Use Cases**: Business logic và rules (`GetUsersUseCase`, `CreateUserUseCase`, etc.)
- **Repository Interfaces**: Contracts cho data access

### Data Layer
- **Models**: WatermelonDB models (`UserModel`)
- **Data Sources**: 
  - Remote Data Source (API calls với Axios)
  - Local Data Source (WatermelonDB operations)
- **Repository Implementations**: Kết hợp remote và local data sources

### Presentation Layer
- **Screens**: UI screens (`UserListScreen`)
- **Components**: Reusable UI components (`UserItem`, `UserForm`)
- **State Management**: Redux Toolkit với typed hooks

### State Management Layer
- **Redux Store**: Centralized state management
- **Slices**: Redux Toolkit slices với async thunks
- **Typed Hooks**: Type-safe Redux hooks (`useAppDispatch`, `useAppSelector`)

### Dependency Injection
- **Container**: Inversify container để manage dependencies
- **Types**: Symbol definitions cho DI

## 📁 Project Structure

```
src/
├── core/
│   ├── entities/
│   │   └── User.ts
│   ├── repositories/
│   │   └── IUserRepository.ts
│   └── usecases/
│       └── user/
│           ├── IGetUsersUseCase.ts
│           ├── GetUsersUseCase.ts
│           ├── ICreateUserUseCase.ts
│           ├── CreateUserUseCase.ts
│           ├── IUpdateUserUseCase.ts
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

### 1. Clean Architecture
- Separation of concerns
- Dependency inversion
- Testable code structure
- Independent of frameworks and UI

### 2. WatermelonDB
- Offline-first local database
- Reactive database queries
- Optimistic updates
- Sync capabilities với remote API

### 3. Dependency Injection
- Sử dụng Inversify container
- Loose coupling between components
- Easy testing và mocking
- Configurable dependencies

### 4. RESTful API Integration
- Axios HTTP client
- Request/Response interceptors
- Error handling
- Automatic retry logic

### 5. Redux Toolkit State Management
- **Centralized State**: Single source of truth
- **Predictable Updates**: Immutable state updates
- **Async Thunks**: Handle async operations
- **Type Safety**: Full TypeScript support
- **DevTools**: Redux DevTools integration

### 6. Modular Design
- Feature-based modules
- Reusable components
- Scalable architecture

## 🛠️ Technologies Used

- **React Native**: Mobile framework
- **TypeScript**: Type safety
- **Redux Toolkit**: State management
- **React Redux**: React bindings for Redux
- **WatermelonDB**: Local database
- **Axios**: HTTP client
- **Inversify**: Dependency injection
- **React Hooks**: UI state management

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

# iOS
npm run ios
```

## 🏗️ Architecture Layers

### 1. **Presentation Layer**
- React Native components và screens
- Redux store connection qua typed hooks
- UI logic và user interactions

### 2. **State Management Layer** 
- Redux Toolkit store
- Slices với async thunks
- Centralized state management

### 3. **Business Logic Layer**
- Use Cases chứa business rules
- Được gọi từ Redux async thunks
- Independent từ UI và data sources

### 4. **Data Layer**
- Repository pattern
- Remote và Local data sources
- WatermelonDB models

### 5. **Dependency Injection Layer**
- Inversify container
- Interface-based dependencies
- Loose coupling between layers

## 🧪 Testing

Với Clean Architecture và Redux, việc testing trở nên dễ dàng:

- **Unit Tests**: Test các Use Cases và business logic
- **Redux Tests**: Test reducers, actions, và async thunks
- **Integration Tests**: Test Repository implementations
- **UI Tests**: Test React components với Redux state

## 🔄 Data Synchronization

App implement offline-first approach:

1. **Local First**: Tất cả operations được thực hiện trên local database trước
2. **Background Sync**: Sync với remote API ở background
3. **Conflict Resolution**: Handle conflicts khi sync
4. **Retry Logic**: Automatic retry khi network có vấn đề

## 🎯 Best Practices

1. **Single Responsibility**: Mỗi class có một responsibility duy nhất
2. **Interface Segregation**: Sử dụng interfaces để define contracts
3. **Dependency Inversion**: Depend on abstractions, not concretions
4. **Error Handling**: Proper error handling ở tất cả layers
5. **Type Safety**: Sử dụng TypeScript cho type safety

## 🚀 Future Enhancements

- [ ] Authentication & Authorization
- [ ] Real-time updates với WebSocket
- [ ] Image upload functionality
- [ ] Advanced search và filtering
- [ ] Data validation với Yup
- [ ] Unit tests với Jest
- [ ] E2E tests với Detox
- [ ] Performance monitoring
- [ ] Redux Persist for offline state
- [ ] Optimistic UI updates
- [ ] Background sync với Redux Saga

## 📝 Notes

- **State Management**: Sử dụng Redux Toolkit thay vì custom hooks
- **API endpoint**: Hiện tại sử dụng JSONPlaceholder cho demo
- **Production**: Cần cấu hình real API endpoint trong production
- **Database**: WatermelonDB sẽ được tạo tự động khi app khởi động
- **Dependencies**: Tất cả dependencies được inject qua DI container
- **TypeScript**: Full type safety với Redux Toolkit và TypeScript
- **DevTools**: Redux DevTools được enable trong development mode

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request
