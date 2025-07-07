# Simplified Single UseCase Interface Architecture

## ✅ **KIẾN TRÚC ĐƠN GIẢN - 1 INTERFACE DUY NHẤT**

### 🎯 **Concept: IUseCase<TInput, TOutput> DUY NHẤT**

Chúng ta đã đơn giản hóa thành công kiến trúc UseCase với:
- **1 interface `IUseCase<TInput, TOutput>` duy nhất**
- **Không có files interface riêng lẻ phức tạp**
- **Types inline đơn giản trong từng UseCase**
- **Clean và maintainable**

### 📁 **Cấu trúc Files**

```
src/core/usecases/
├── base/
│   ├── IBaseUseCase.ts          # IUseCase<TInput, TOutput> duy nhất
│   └── BaseUseCase.ts           # BaseUseCase & ValidatedUseCase
└── user/
    ├── CreateUserUseCase.ts     # implements IUseCase
    ├── GetUsersUseCase.ts       # implements IUseCase  
    ├── UpdateUserUseCase.ts     # implements IUseCase
    └── DeleteUserUseCase.ts     # implements IUseCase
```

**❌ Đã XÓA:**
- `ICreateUserUseCase.ts`
- `IGetUsersUseCase.ts`  
- `IUpdateUserUseCase.ts`
- `IDeleteUserUseCase.ts`
- `types.ts`

### 🔧 **Implementation Pattern**

#### **Base Interface (DUY NHẤT):**
```typescript
// src/core/usecases/base/IBaseUseCase.ts
export interface IUseCase<TInput = void, TOutput = void> {
  execute(input: TInput): Promise<TOutput>;
}
```

#### **UseCase Implementation:**
```typescript
// src/core/usecases/user/CreateUserUseCase.ts
import { IUseCase } from '../base/IBaseUseCase';
import { User } from '../../entities/User';

// Simple types inline
type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
type CreateUserOutput = User;

@injectable()
export class CreateUserUseCase 
  extends ValidatedUseCase<CreateUserInput, CreateUserOutput> 
  implements IUseCase<CreateUserInput, CreateUserOutput> {
  
  validateInput(userData: CreateUserInput): boolean {
    if (!userData.name) throw new Error('User name is required');
    if (!userData.email) throw new Error('User email is required');
    return true;
  }

  protected async executeBusinessLogic(userData: CreateUserInput): Promise<CreateUserOutput> {
    return await this.userRepository.createUser(userData);
  }
}
```

### 🔄 **Flow Hoạt Động**

```
[Component] 
  ↓ dispatch(createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>))
[Redux Slice] 
  ↓ container.get(TYPES.CreateUserUseCase) as any
[CreateUserUseCase] 
  ↓ implements IUseCase<CreateUserInput, CreateUserOutput>
  ↓ extends ValidatedUseCase<CreateUserInput, CreateUserOutput>
[ValidatedUseCase]
  ↓ 1. validateInput(userData)
  ↓ 2. executeBusinessLogic(userData)
[UserRepository]
  ↓ createUser(userData): Promise<User>
[Database/API]
  ↓ Return User
[Component] 
  ↓ state.users updated
```

### 📋 **DI Container - Đơn Giản**

```typescript
// src/di/container.ts
container.bind(TYPES.CreateUserUseCase).toDynamicValue(() => {
  const userRepository = container.get<IUserRepository>(TYPES.UserRepository);
  return new CreateUserUseCase(userRepository);
});
```

### 🎭 **Redux Integration - Đơn Giản**

```typescript
// src/store/slices/usersSlice.ts
export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const createUserUseCase = container.get(TYPES.CreateUserUseCase) as any;
      const newUser = await createUserUseCase.execute(userData);
      return newUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### 🎨 **Component Usage - Đơn Giản**

```typescript
// src/presentation/screens/UserListScreen.tsx
const handleSaveUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
  if (editingUser) {
    await dispatch(updateUserAction({ id: editingUser.id, userData }));
  } else {
    await dispatch(createUserAction(userData));
  }
};
```

### ✨ **Lợi Ích Đạt Được**

#### ✅ **1. Simplicity**
- **1 interface `IUseCase<TInput, TOutput>` duy nhất**
- Không có files interface phức tạp
- Types inline đơn giản

#### ✅ **2. Clean Structure**
- Loại bỏ duplicate code
- Dễ hiểu và maintain
- Không over-engineering

#### ✅ **3. Type Safety**
```typescript
// ✅ Vẫn có type safety
const userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
  name: 'John',
  email: 'john@email.com',
  isActive: true
};

// ❌ Compile error nếu thiếu fields
const invalidData = { name: 'John' }; // Missing email, isActive
```

#### ✅ **4. Extensibility**
```typescript
// Thêm UseCase mới rất dễ
type SendEmailInput = { to: string; subject: string; body: string };
type SendEmailOutput = { messageId: string; status: string };

@injectable()
export class SendEmailUseCase 
  extends ValidatedUseCase<SendEmailInput, SendEmailOutput> 
  implements IUseCase<SendEmailInput, SendEmailOutput> {
  // Implementation
}
```

#### ✅ **5. Testing**
```typescript
// Mock đơn giản
const mockUseCase = {
  execute: jest.fn().mockResolvedValue(expectedResult)
};

// Type-safe testing vẫn hoạt động
const result = await mockUseCase.execute(validInput);
```

### 🎯 **Pattern Summary**

1. **1 Base Interface**: `IUseCase<TInput, TOutput>`
2. **Inline Types**: Đặt types trong từng UseCase file
3. **Simple DI**: Không cần complex typing trong container
4. **Type Safety**: Vẫn đảm bảo compile-time checking
5. **Clean Code**: Loại bỏ unnecessary complexity

### 🚀 **Best Practices**

1. **Keep It Simple**: Đừng over-engineer
2. **Inline Types**: Types nhỏ thì inline trong file UseCase
3. **Single Interface**: Chỉ dùng `IUseCase<TInput, TOutput>`
4. **Validation**: Dùng `ValidatedUseCase` khi cần validation
5. **Error Handling**: Dùng `BaseUseCase` cho error handling

### 📝 **Kết Luận**

**Kiến trúc này hoàn hảo vì:**
- ✅ **Đơn giản**: 1 interface duy nhất
- ✅ **Type Safe**: Vẫn có compile-time checking  
- ✅ **Clean**: Không có files thừa
- ✅ **Maintainable**: Dễ maintain và extend
- ✅ **Practical**: Thực tế và hiệu quả

**Đây chính là cái bạn muốn: 1 UseCase interface đơn giản, kiểm soát input/output, không phức tạp!** 🎉
