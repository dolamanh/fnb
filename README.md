# 🍽️ FnB App - Food & Beverage Management

**Clean Architecture React Native App with TypeScript, Redux Toolkit & WatermelonDB**

[![React Native](https://img.shields.io/badge/React%20Native-v0.80-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.x-blue.svg)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-v2.x-purple.svg)](https://redux-toolkit.js.org/)
[![WatermelonDB](https://img.shields.io/badge/WatermelonDB-v0.27-green.svg)](https://nozbe.github.io/WatermelonDB/)

## 📋 Tổng quan

FnB App là ứng dụng quản lý Food & Beverage được xây dựng theo **Clean Architecture** với các công nghệ hiện đại:

- **🏗️ Clean Architecture** - Tách biệt rõ ràng các layer và dependency direction
- **⚛️ React Native** - Cross-platform mobile development
- **🔷 TypeScript** - Type safety và developer experience tốt hơn
- **🔄 Redux Toolkit** - State management predictable và hiệu quả
- **💾 WatermelonDB** - Offline-first database với sync capabilities
- **🔌 InversifyJS** - Dependency Injection container
- **🧪 Jest** - Unit testing framework

## 🏗️ Kiến trúc Clean Architecture

```
src/
├── 🧠 core/                    # Domain Layer
│   ├── entities/              # Business entities (User, Cart)
│   ├── errors/                # Domain errors (ValidationError, BusinessRuleError)
│   ├── ports/                 # Interfaces (repositories, services, datasources)
│   └── usecases/              # Business logic (GetUsers, CreateUser, etc.)
│
├── 🔧 infrastructure/         # Framework Layer
│   ├── api/                   # DTOs và mappers cho API
│   ├── database/              # Database models và schema
│   ├── datasources/           # Concrete implementations (remote/local)
│   ├── errors/                # Infrastructure errors (ApiError, NetworkError)
│   ├── patterns/              # Infrastructure patterns (CircuitBreaker)
│   ├── repositories/          # Repository implementations
│   └── services/              # Service implementations (API, Database)
│
├── 🎨 presentation/           # UI Layer
│   ├── components/            # Reusable React components
│   ├── mappers/               # View mappers (Domain → ViewModel)
│   ├── models/                # ViewModels cho UI
│   ├── screens/               # Screen components
│   └── store/                 # Redux store, slices, hooks
│
├── 🔌 di/                     # Dependency Injection
│   ├── container.ts           # DI container configuration
│   └── types.ts               # DI type symbols
│
└── 🐛 debug/                  # Debug utilities
    └── TestDI.ts              # DI testing utilities
```

## 🔄 Dependency Direction

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │───▶│      Core       │◄───│ Infrastructure  │
│   (UI Layer)    │    │ (Business Logic)│    │ (Framework)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       ▲                       ▲
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                        ┌─────────────────┐
                        │       DI        │
                        │   Container     │
                        └─────────────────┘
```

**Nguyên tắc:** Core không phụ thuộc vào bất kỳ layer nào. Infrastructure và Presentation đều phụ thuộc vào Core.

## 🚀 Bắt đầu

### Yêu cầu hệ thống

- **Node.js** 18+ 
- **React Native CLI** hoặc **Expo CLI**
- **Android Studio** (cho Android development)
- **Xcode** (cho iOS development - macOS only)
- **Git**

### Cài đặt

```bash
# Clone repository
git clone https://github.com/dolamanh/fnb.git
cd fnb

# Cài đặt dependencies
npm install

# Cài đặt pods cho iOS (chỉ trên macOS)
cd ios && pod install && cd ..

# Khởi động Metro bundler
npm start

# Chạy trên Android
npm run android

# Chạy trên iOS (chỉ trên macOS)
npm run ios
```

### Build Commands

```bash
# Development build
npm run build:dev

# Production build
npm run build:prod

# Clean cache và rebuild
npm run clean
npx react-native start --reset-cache
```

## 📱 Tính năng

### ✅ Đã triển khai

- **👥 User Management**
  - Xem danh sách users
  - Tạo user mới
  - Cập nhật thông tin user
  - Xóa user
  - Tìm kiếm và filter

- **🛒 Cart Management**
  - Xem danh sách carts
  - Quản lý items trong cart
  - Tính toán tổng giá trị

- **💾 Offline Support**
  - Local database với WatermelonDB
  - Sync với remote API
  - Hoạt động offline

- **🔧 Technical Features**
  - Type-safe Redux với RTK
  - Dependency Injection với InversifyJS
  - Error handling toàn diện
  - Loading states và error states
  - Pull-to-refresh
  - Circuit breaker pattern

### 🚧 Đang phát triển

- **🔐 Authentication & Authorization**
- **📊 Analytics Dashboard** 
- **🔔 Push Notifications**
- **🌐 Multi-language Support**
- **🎨 Theme Customization**

## 🧪 Testing

```bash
# Chạy unit tests
npm test

# Chạy tests với coverage
npm run test:coverage

# Chạy tests ở watch mode
npm run test:watch

# Chạy E2E tests (nếu có)
npm run test:e2e
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
│   ├── datasources/
│   └── services/
└── presentation/
    ├── components/
    ├── screens/
    └── store/
```

## 🔧 Development

### VS Code Setup

Khuyến nghị extensions:

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-jest",
    "msjsdiag.vscode-react-native"
  ]
}
```

### Debug Configuration

File `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Android",
      "type": "reactnative",
      "request": "launch",
      "platform": "android"
    },
    {
      "name": "Debug iOS",
      "type": "reactnative", 
      "request": "launch",
      "platform": "ios"
    }
  ]
}
```

### Code Style

Project sử dụng:
- **ESLint** cho code linting
- **Prettier** cho code formatting
- **Husky** cho pre-commit hooks
- **Conventional Commits** cho commit messages

```bash
# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format
```

## 📊 State Management

### Redux Store Structure

```typescript
RootState {
  users: {
    users: User[],
    loading: boolean,
    error: string | null
  },
  carts: {
    carts: Cart[],
    loading: boolean,
    error: string | null
  }
}
```

### Async Thunks

```typescript
// Fetch users with error handling
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const getUsersUseCase = container.get<IGetUsersUseCase>(TYPES.GetUsersUseCase);
      return await getUsersUseCase.execute();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

## 💾 Database Schema

### WatermelonDB Models

```typescript
// User Model
class UserModel extends Model {
  static table = 'users';
  
  @text('name') name!: string;
  @text('email') email!: string;
  @text('phone') phone?: string;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}

// Cart Model  
class CartModel extends Model {
  static table = 'carts';
  
  @text('user_id') userId!: string;
  @json('items', sanitizeCartItems) items!: CartItem[];
  @field('total') total!: number;
  @date('created_at') createdAt!: Date;
}
```

## 🔌 Dependency Injection

### Container Configuration

```typescript
// DI Types
const TYPES = {
  // Services
  ApiService: Symbol.for('ApiService'),
  DatabaseService: Symbol.for('DatabaseService'),
  
  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  CartRepository: Symbol.for('CartRepository'),
  
  // Use Cases
  GetUsersUseCase: Symbol.for('GetUsersUseCase'),
  CreateUserUseCase: Symbol.for('CreateUserUseCase'),
};

// Container Binding
container.bind(TYPES.UserRepository).toDynamicValue(() => {
  const localDS = container.get<IUserLocalDataSource>(TYPES.UserLocalDataSource);
  const remoteDS = container.get<IUserRemoteDataSource>(TYPES.UserRemoteDataSource);
  return new UserRepository(localDS, remoteDS);
});
```

## 🛠️ API Integration

### External APIs

- **JSONPlaceholder** - Mock REST API cho development
- **Custom Backend** - Production API endpoints

### API Service

```typescript
class ApiService implements IApiService {
  private axios: AxiosInstance;
  
  async get<T>(url: string): Promise<T> {
    try {
      const response = await this.axios.get<T>(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  private handleError(error: any): Error {
    // Comprehensive error handling
    return new ApiError(error.message, error.status);
  }
}
```

## 📁 File Structure Chi tiết

```
fnb/
├── 📱 App.tsx                 # Root component
├── 🔧 index.js               # Entry point
├── 📦 package.json           # Dependencies
├── ⚙️ metro.config.js        # Metro bundler config
├── 🔷 tsconfig.json          # TypeScript config
├── 🧪 jest.config.js         # Jest testing config
│
├── 📱 android/               # Android native code
├── 🍎 ios/                   # iOS native code  
│
├── 📁 src/
│   ├── 🧠 core/
│   │   ├── entities/
│   │   │   ├── user/User.ts
│   │   │   └── cart/Cart.ts
│   │   ├── errors/
│   │   │   ├── BaseError.ts
│   │   │   └── DomainErrors.ts
│   │   ├── ports/
│   │   │   ├── repositories/
│   │   │   ├── services/
│   │   │   └── datasources/
│   │   └── usecases/
│   │       ├── user/
│   │       └── cart/
│   │
│   ├── 🔧 infrastructure/
│   │   ├── api/
│   │   │   ├── dtos/
│   │   │   └── mappers/
│   │   ├── database/
│   │   │   ├── UserModel.ts
│   │   │   ├── CartModel.ts
│   │   │   └── schema.ts
│   │   ├── datasources/
│   │   │   ├── local/
│   │   │   └── remote/
│   │   ├── errors/
│   │   │   ├── InfrastructureErrors.ts
│   │   │   └── ErrorHandler.ts
│   │   ├── patterns/
│   │   │   └── CircuitBreaker.ts
│   │   ├── repositories/
│   │   │   ├── UserRepository.ts
│   │   │   └── CartRepository.ts
│   │   └── services/
│   │       ├── ApiService.ts
│   │       └── DatabaseService.ts
│   │
│   ├── 🎨 presentation/
│   │   ├── components/
│   │   │   ├── UserItem.tsx
│   │   │   └── UserForm.tsx
│   │   ├── mappers/
│   │   │   └── UserViewMapper.ts
│   │   ├── models/
│   │   │   ├── UserViewModel.ts
│   │   │   └── CartViewModel.ts
│   │   ├── screens/
│   │   │   ├── MainScreen.tsx
│   │   │   └── UserListScreen.tsx
│   │   └── store/
│   │       ├── index.ts
│   │       ├── hooks.ts
│   │       └── slices/
│   │           ├── usersSlice.ts
│   │           └── cartsSlice.ts
│   │
│   ├── 🔌 di/
│   │   ├── container.ts
│   │   └── types.ts
│   │
│   ├── 🐛 debug/
│   │   └── TestDI.ts
│   │
│   └── 📄 index.ts
│
├── 📋 __tests__/             # Test files
├── 🎨 assets/                # Images, fonts, etc.
└── 📚 docs/                  # Documentation
    └── FLOW_DOCUMENTATION.md
```

## 🌐 Environment Configuration

### Development

```bash
# .env.development
API_BASE_URL=https://jsonplaceholder.typicode.com
DATABASE_NAME=fnb_dev.db
LOG_LEVEL=debug
ENABLE_FLIPPER=true
```

### Production

```bash
# .env.production  
API_BASE_URL=https://api.fnb-app.com
DATABASE_NAME=fnb_prod.db
LOG_LEVEL=error
ENABLE_FLIPPER=false
```

## 📈 Performance

### Optimization Strategies

- **Code Splitting** - Dynamic imports cho large components
- **Memoization** - React.memo và useMemo
- **Virtualization** - FlatList cho large datasets
- **Image Optimization** - Lazy loading và caching
- **Bundle Analysis** - Metro bundle analyzer

### Memory Management

- **Singleton Services** - Shared instances cho API và Database
- **Component Cleanup** - useEffect cleanup functions
- **State Normalization** - Flat state structure trong Redux
- **Cache Invalidation** - Intelligent cache management

## 🚀 Deployment

### Android

```bash
# Debug build
npm run android

# Release build
cd android
./gradlew assembleRelease

# Install release APK
adb install app/build/outputs/apk/release/app-release.apk
```

### iOS

```bash
# Debug build
npm run ios

# Release build (Xcode required)
# Open ios/fnb.xcworkspace in Xcode
# Product → Archive → Distribute App
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
      - run: npm run lint
      - run: npm run type-check
```

## 🤝 Contributing

### Development Workflow

1. **Fork** repository
2. **Create** feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** branch: `git push origin feature/amazing-feature`
5. **Create** Pull Request

### Coding Standards

- **Clean Architecture** principles
- **SOLID** principles
- **DRY** (Don't Repeat Yourself)
- **KISS** (Keep It Simple, Stupid)
- **TypeScript** strict mode
- **100% test coverage** cho business logic

### Commit Convention

```
feat: add user authentication
fix: resolve cart calculation bug
docs: update API documentation
style: format code with prettier
refactor: improve error handling
test: add unit tests for UserRepository
chore: update dependencies
```

## 📄 License

MIT License - xem [LICENSE](LICENSE) file để biết chi tiết.

## 👥 Authors

- **dolamanh** - *Initial work* - [dolamanh](https://github.com/dolamanh)

## 🙏 Acknowledgments

- **Uncle Bob** - Clean Architecture concepts
- **Redux Team** - Redux Toolkit
- **Nozbe** - WatermelonDB
- **Microsoft** - TypeScript
- **Facebook** - React Native

## 📞 Support

Nếu có vấn đề hoặc câu hỏi:

- 🐛 **Issues**: [GitHub Issues](https://github.com/dolamanh/fnb/issues)
- 📧 **Email**: dolamanh@example.com
- 💬 **Discord**: [FnB App Community](https://discord.gg/fnb-app)

---

**Made with ❤️ by the FnB Team**
