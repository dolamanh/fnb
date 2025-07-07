# 📋 FnB App - Tài liệu luồng hoạt động và liên kết code

## 📚 Mục lục
1. [Tổng quan kiến trúc](#tổng-quan-kiến-trúc)
2. [Luồng khởi động ứng dụng](#luồng-khởi-động-ứng-dụng)
3. [Luồng Dependency Injection](#luồng-dependency-injection)
4. [Luồng Redux State Management](#luồng-redux-state-management)
5. [Luồng CRUD Operations](#luồng-crud-operations)
6. [Luồng UI Rendering](#luồng-ui-rendering)
7. [Sơ đồ liên kết files](#sơ-đồ-liên-kết-files)
8. [Error Handling Flow](#error-handling-flow)

---

## 🏗️ Tổng quan kiến trúc

```
┌─────────────────────────────────────────────────────────────┐
│                         APP.TSX                             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Redux Store   │ │   DI Container  │ │  SafeAreaView   ││
│  │   Provider      │ │   Initialization│ │   StatusBar     ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 PRESENTATION LAYER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              UserListScreen.tsx                      │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐ │   │
│  │  │ useAppSel.. │ │ useAppDisp..│ │  Components     │ │   │
│  │  │   (hooks)   │ │   (hooks)   │ │ UserItem/Form   │ │   │
│  │  └─────────────┘ └─────────────┘ └─────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                STATE MANAGEMENT LAYER                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                Redux Store                           │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐ │   │
│  │  │ usersSlice  │ │ Async Thunk │ │   Middleware    │ │   │
│  │  │ (reducers)  │ │  (actions)  │ │  (serialCheck)  │ │   │
│  │  └─────────────┘ └─────────────┘ └─────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 BUSINESS LOGIC LAYER                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                 Use Cases                            │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐ │   │
│  │  │GetUsersUse..│ │CreateUser.. │ │UpdateUser/Del.. │ │   │
│  │  │    Case     │ │    Case     │ │     Cases       │ │   │
│  │  └─────────────┘ └─────────────┘ └─────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │               UserRepository                         │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐ │   │
│  │  │   Remote    │ │    Local    │ │    Sync Logic   │ │   │
│  │  │ DataSource  │ │ DataSource  │ │   (API+DB)      │ │   │
│  │  └─────────────┘ └─────────────┘ └─────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               EXTERNAL SERVICES                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐ │   │
│  │  │    Axios    │ │ WatermelonDB│ │   JSONPlaceh..  │ │   │
│  │  │ (ApiService)│ │(DatabaseSvc)│ │      API        │ │   │
│  │  └─────────────┘ └─────────────┘ └─────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Luồng khởi động ứng dụng

### 1. Entry Point: `index.js`
```javascript
import { AppRegistry } from 'react-native';
import App from './App';
AppRegistry.registerComponent('fnb', () => App);
```

### 2. App Component: `App.tsx`
```typescript
// File: App.tsx
function App() {
  useEffect(() => {
    const initializeApp = async () => {
      // 1. Khởi tạo DI Container
      const databaseService = container.get<IDatabaseService>(TYPES.DatabaseService);
      
      // 2. Khởi tạo Database
      await databaseService.initializeDatabase();
      
      console.log('App initialized successfully');
    };
    initializeApp();
  }, []);

  return (
    <Provider store={store}>           {/* 3. Wrap Redux Provider */}
      <SafeAreaView style={styles.container}>
        <StatusBar />                  {/* 4. Global StatusBar */}
        <UserListScreen />            {/* 5. Main Screen */}
      </SafeAreaView>
    </Provider>
  );
}
```

### Sơ đồ luồng khởi động:
```
Start App
    │
    ▼
index.js registers App component
    │
    ▼
App.tsx mounts
    │
    ▼
useEffect runs
    │
    ▼
┌─────────────────────────────┐
│  Initialize DI Container    │
│  ┌─────────────────────────┐│
│  │ ApiService (Singleton)  ││
│  │ DatabaseService (Single)││
│  │ DataSources             ││
│  │ Repository              ││
│  │ Use Cases               ││
│  └─────────────────────────┘│
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│  Initialize Database        │
│  ┌─────────────────────────┐│
│  │ WatermelonDB Setup      ││
│  │ Schema Creation         ││
│  │ Database Ready          ││
│  └─────────────────────────┘│
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│  Redux Store Provider       │
│  ┌─────────────────────────┐│
│  │ Store Configuration     ││
│  │ Middleware Setup        ││
│  │ State Initialization    ││
│  └─────────────────────────┘│
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│  UserListScreen Renders     │
│  ┌─────────────────────────┐│
│  │ Components Mount        ││
│  │ useEffect Triggered     ││
│  │ fetchUsers() Dispatched ││
│  └─────────────────────────┘│
└─────────────────────────────┘
```

---

## 🔗 Luồng Dependency Injection

### DI Container Setup: `src/di/container.ts`
```typescript
// File: src/di/container.ts
const container = new Container();

// 1. Services (Singletons)
container.bind(TYPES.ApiService).toDynamicValue(() => {
  return new ApiService();
}).inSingletonScope();

container.bind(TYPES.DatabaseService).toDynamicValue(() => {
  return new DatabaseService();
}).inSingletonScope();

// 2. Data Sources
container.bind(TYPES.UserRemoteDataSource).toDynamicValue(() => {
  const apiService = container.get<IApiService>(TYPES.ApiService);
  return new UserRemoteDataSource(apiService);
});

container.bind(TYPES.UserLocalDataSource).toDynamicValue(() => {
  const databaseService = container.get<IDatabaseService>(TYPES.DatabaseService);
  return new UserLocalDataSource(databaseService);
});

// 3. Repository
container.bind(TYPES.UserRepository).toDynamicValue(() => {
  const localDataSource = container.get<IUserLocalDataSource>(TYPES.UserLocalDataSource);
  const remoteDataSource = container.get<IUserRemoteDataSource>(TYPES.UserRemoteDataSource);
  return new UserRepository(localDataSource, remoteDataSource);
});

// 4. Use Cases
container.bind(TYPES.GetUsersUseCase).toDynamicValue(() => {
  const userRepository = container.get<IUserRepository>(TYPES.UserRepository);
  return new GetUsersUseCase(userRepository);
});
```

### Sơ đồ DI Dependencies:
```
┌─────────────────────────────────────────────────────────────────┐
│                      DI CONTAINER                               │
│                                                                 │
│  ┌─────────────────┐              ┌─────────────────┐          │
│  │  ApiService     │◄─────────────┤ UserRemoteDS    │          │
│  │  (Singleton)    │              │                 │          │
│  └─────────────────┘              └─────────────────┘          │
│                                             │                   │
│  ┌─────────────────┐              ┌─────────────────┐          │
│  │ DatabaseService │◄─────────────┤ UserLocalDS     │          │
│  │  (Singleton)    │              │                 │          │
│  └─────────────────┘              └─────────────────┘          │
│                                             │                   │
│                                   ┌─────────────────┐          │
│                                   │ UserRepository  │          │
│                                   │                 │          │
│                                   └─────────────────┘          │
│                                             │                   │
│                                   ┌─────────────────┐          │
│                                   │   Use Cases     │          │
│                                   │ Get/Create/     │          │
│                                   │ Update/Delete   │          │
│                                   └─────────────────┘          │
│                                             │                   │
│                                   ┌─────────────────┐          │
│                                   │ Redux Thunks    │          │
│                                   │ (Call UseCases) │          │
│                                   └─────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Luồng Redux State Management

### Redux Store Configuration: `src/store/index.ts`
```typescript
// File: src/store/index.ts
export const store = configureStore({
  reducer: {
    users: usersReducer,      // Users slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Date objects in User entity
        ignoredActions: ['users/createUser/fulfilled', ...],
        ignoredActionsPaths: ['payload.createdAt', 'payload.updatedAt'],
        ignoredPaths: ['users.users'],
      },
    }),
  devTools: __DEV__,
});

// Type-safe hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Users Slice: `src/store/slices/usersSlice.ts`
```typescript
// File: src/store/slices/usersSlice.ts

// 1. State Interface
interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

// 2. Async Thunks (Business Logic Bridge)
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      // Call Use Case through DI
      const getUsersUseCase = container.get<IGetUsersUseCase>(TYPES.GetUsersUseCase);
      const users = await getUsersUseCase.execute();
      return users;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 3. Slice with Reducers
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetUsers: (state) => {
      state.users = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle async thunk states
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
```

### Sơ đồ Redux Flow:
```
┌─────────────────────────────────────────────────────────────────┐
│                        REDUX FLOW                               │
│                                                                 │
│  User Action (Button Click)                                     │
│            │                                                    │
│            ▼                                                    │
│  ┌─────────────────┐     dispatch(fetchUsers())                │
│  │   Component     │────────────────────────────────────────┐  │
│  │ (UserListScreen)│                                        │  │
│  └─────────────────┘                                        │  │
│            ▲                                                 │  │
│            │ useAppSelector(state => state.users)            │  │
│            │                                                 ▼  │
│  ┌─────────────────┐                            ┌─────────────────┐│
│  │   Redux Store   │                            │  Async Thunk    ││
│  │                 │                            │  (fetchUsers)   ││
│  │ ┌─────────────┐ │ ◄─── state update ────────│                 ││
│  │ │ usersSlice  │ │                            │ ┌─────────────┐ ││
│  │ │   state     │ │                            │ │   pending   │ ││
│  │ │ ─ users[]   │ │                            │ │  fulfilled  │ ││
│  │ │ ─ loading   │ │                            │ │  rejected   │ ││
│  │ │ ─ error     │ │                            │ └─────────────┘ ││
│  │ └─────────────┘ │                            └─────────────────┘│
│  └─────────────────┘                                        │  │
│                                                             │  │
│                                                             ▼  │
│                                               ┌─────────────────┐│
│                                               │   Use Cases     ││
│                                               │ (via DI Container)││
│                                               │                 ││
│                                               │ GetUsersUseCase ││
│                                               │      │          ││
│                                               │      ▼          ││
│                                               │ UserRepository  ││
│                                               │      │          ││
│                                               │      ▼          ││
│                                               │  Data Sources   ││
│                                               │   (API + DB)    ││
│                                               └─────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Luồng CRUD Operations

### 1. Fetch Users Flow:
```
UserListScreen.tsx
      │ useEffect(() => dispatch(fetchUsers()))
      ▼
store/slices/usersSlice.ts
      │ fetchUsers async thunk
      ▼
DI Container
      │ container.get<IGetUsersUseCase>(TYPES.GetUsersUseCase)
      ▼
core/usecases/user/GetUsersUseCase.ts
      │ execute() method
      ▼
data/repositories/UserRepository.ts
      │ getUsers() method
      ▼
┌─────────────────┐         ┌─────────────────┐
│ UserRemoteDS    │   +     │ UserLocalDS     │
│ (API Call)      │         │ (Database)      │
│                 │         │                 │
│ apiService.get()│         │ database.query()│
│ /users endpoint │         │ UserModel       │
└─────────────────┘         └─────────────────┘
      │                           │
      ▼                           ▼
┌─────────────────────────────────────────────┐
│          Repository Logic                   │
│  1. Try fetch from API                      │
│  2. If success, save to local DB            │
│  3. Return API data                         │
│  4. If API fails, return local data         │
│  5. Transform DTOs to Domain entities       │
└─────────────────────────────────────────────┘
      │
      ▼
GetUsersUseCase returns User[] entities
      │
      ▼
Redux thunk receives data
      │
      ▼
usersSlice.fulfilled action updates state
      │
      ▼
Component re-renders with new data
```

### 2. Create User Flow:
```
UserForm.tsx
      │ onSave(userData)
      ▼
UserListScreen.tsx
      │ dispatch(createUser(userData))
      ▼
store/slices/usersSlice.ts
      │ createUser async thunk
      ▼
core/usecases/user/CreateUserUseCase.ts
      │ execute(userData)
      ▼
data/repositories/UserRepository.ts
      │ createUser(userData)
      ▼
┌─────────────────┐         ┌─────────────────┐
│ UserRemoteDS    │  API    │ UserLocalDS     │
│                 │  Call   │                 │
│ POST /users     │ ──────► │ Save to DB      │
│ with userData   │ Success │ after API       │
└─────────────────┘         └─────────────────┘
      │
      ▼
Repository returns new User entity
      │
      ▼
Redux state updated (user added to array)
      │
      ▼
UI re-renders showing new user in list
```

---

## 🎨 Luồng UI Rendering

### Component Hierarchy:
```
App.tsx
 │
 ├── Redux Provider
 ├── SafeAreaView
 ├── StatusBar
 │
 └── UserListScreen.tsx
      │
      ├── useAppSelector(state => state.users)
      ├── useAppDispatch()
      │
      ├── Header Section
      │   ├── Title: "Users"
      │   └── Add Button
      │
      ├── Error Section (conditional)
      │   ├── Error Message
      │   ├── Retry Button
      │   └── Clear Button
      │
      ├── FlatList
      │   ├── renderItem: UserItem.tsx
      │   │   ├── User Info Display
      │   │   ├── Edit Button → onEdit(user)
      │   │   └── Delete Button → onDelete(user.id)
      │   │
      │   ├── ListEmptyComponent
      │   │   ├── "No users found"
      │   │   └── "Create First User" Button
      │   │
      │   └── RefreshControl
      │       └── Pull to Refresh → fetchUsers()
      │
      ├── Loading Indicator (conditional)
      │
      └── Modal
          └── UserForm.tsx
              ├── Name Input
              ├── Email Input
              ├── Phone Input (optional)
              ├── Save Button → onSave(formData)
              └── Cancel Button → onCancel()
```

### Rendering Flow:
```
1. App.tsx renders
   │
   ▼
2. Redux Provider provides store
   │
   ▼
3. UserListScreen mounts
   │
   ▼
4. useAppSelector subscribes to state.users
   │
   ▼
5. useEffect dispatches fetchUsers()
   │
   ▼
6. Loading state = true → Show loading indicator
   │
   ▼
7. API call completes → Redux state updated
   │
   ▼
8. Component re-renders with new data
   │
   ▼
9. FlatList renders UserItem for each user
   │
   ▼
10. User interactions trigger more dispatches
```

---

## 📁 Sơ đồ liên kết files

### File Dependencies Map:
```
App.tsx
├── src/store/index.ts (Redux store)
│   ├── src/store/slices/usersSlice.ts
│   │   ├── src/core/entities/User.ts
│   │   ├── src/di/container.ts
│   │   └── src/di/types.ts
│   └── src/store/hooks.ts
│       └── src/store/index.ts (RootState, AppDispatch)
│
├── src/di/container.ts (DI setup)
│   ├── src/di/types.ts (Symbols)
│   ├── src/data/datasources/ApiService.ts
│   ├── src/data/datasources/DatabaseService.ts
│   ├── src/data/datasources/UserRemoteDataSource.ts
│   ├── src/data/datasources/UserLocalDataSource.ts
│   ├── src/data/repositories/UserRepository.ts
│   ├── src/core/usecases/user/GetUsersUseCase.ts
│   ├── src/core/usecases/user/CreateUserUseCase.ts
│   ├── src/core/usecases/user/UpdateUserUseCase.ts
│   └── src/core/usecases/user/DeleteUserUseCase.ts
│
└── src/presentation/screens/UserListScreen.tsx
    ├── src/store/hooks.ts (useAppDispatch, useAppSelector)
    ├── src/store/slices/usersSlice.ts (actions)
    ├── src/presentation/components/UserItem.tsx
    │   └── src/core/entities/User.ts
    ├── src/presentation/components/UserForm.tsx
    │   └── src/core/entities/User.ts
    └── src/debug/TestDI.ts
```

### Cross-Layer Communication:
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │    │ State Management│    │ Business Logic  │
│                 │    │                 │    │                 │
│ UserListScreen ─┼───►│ Redux Thunks   ─┼───►│   Use Cases     │
│ useAppSelector ◄┼────│ Redux State     │    │                 │
│ useAppDispatch  │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│       DI        │    │   Data Layer    │    │ External APIs   │
│                 │    │                 │    │                 │
│   Container    ◄┼────│   Repository   ─┼───►│ JSONPlaceholder │
│   Factory      ─┼───►│   DataSources   │    │  WatermelonDB   │
│   Singleton     │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## ⚠️ Error Handling Flow

### Error Propagation Chain:
```
External API Error
        │
        ▼
ApiService catches HTTP errors
        │
        ▼
UserRemoteDataSource wraps with custom errors
        │
        ▼
UserRepository handles data source errors
        │
        ▼
Use Cases receive repository errors
        │
        ▼
Redux Thunk rejectWithValue(error.message)
        │
        ▼
usersSlice.rejected case updates error state
        │
        ▼
Component displays error to user
        │
        ▼
User can retry or clear error
```

### Error Handling Code Example:
```typescript
// In AsyncThunk
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const getUsersUseCase = container.get<IGetUsersUseCase>(TYPES.GetUsersUseCase);
      const users = await getUsersUseCase.execute();
      return users;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
      console.error('Failed to fetch users:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

// In Component
{error && (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{error}</Text>
    <TouchableOpacity onPress={() => dispatch(fetchUsers())}>
      <Text>Retry</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => dispatch(clearError())}>
      <Text>Clear</Text>
    </TouchableOpacity>
  </View>
)}
```

---

## 🔧 Development Tools Integration

### Redux DevTools Flow:
```
Component Action
        │
        ▼
Redux Store
        │
        ▼
DevTools Extension
        │
        ├── Action History
        ├── State Snapshots
        ├── Time Travel Debug
        └── State Diff Viewer
```

### TypeScript Integration:
```
Interface Definitions
        │
        ▼
Type-safe Redux Hooks
        │
        ▼
Component Props Validation
        │
        ▼
Compile-time Error Checking
        │
        ▼
IDE Autocomplete & IntelliSense
```

---

## 📈 Performance Considerations

### Optimization Strategies:
1. **Memoization**: React.memo() for components
2. **Selector Optimization**: Reselect for derived state
3. **Lazy Loading**: Dynamic imports for large components
4. **Bundle Splitting**: Separate chunks for features
5. **Database Indexing**: WatermelonDB query optimization

### Memory Management:
```
DI Container (Singleton Services)
        │
        ├── Single ApiService instance
        ├── Single DatabaseService instance
        └── Factory for Use Cases (new instances)

Redux Store
        │
        ├── Normalized state structure
        ├── Cleanup actions for memory
        └── Middleware for persistence
```

---

## 🚀 Deployment Flow

### Build Process:
```
TypeScript Compilation
        │
        ▼
Metro Bundler
        │
        ▼
Android Gradle Build
        │
        ▼
APK Generation
        │
        ▼
Device Installation
        │
        ▼
App Launch & Initialization
```

### Environment Configuration:
```
Development:
├── DEV API endpoints
├── Debug logging enabled
├── Redux DevTools enabled
└── Hot reloading active

Production:
├── PROD API endpoints
├── Optimized bundles
├── Error tracking
└── Performance monitoring
```

---

## 📚 Conclusion

Ứng dụng FnB được xây dựng với Clean Architecture và Redux Toolkit, đảm bảo:

- **Separation of Concerns**: Mỗi layer có trách nhiệm riêng biệt
- **Dependency Inversion**: Dependencies được inject, không hard-coded
- **Testability**: Các layer có thể test độc lập
- **Scalability**: Dễ dàng thêm features mới
- **Maintainability**: Code dễ đọc, sửa đổi và maintain
- **Type Safety**: Full TypeScript support
- **State Management**: Predictable state updates với Redux

Kiến trúc này cho phép team development hiệu quả và đảm bảo chất lượng code cao trong dài hạn.
