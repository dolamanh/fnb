# ULTRA SIMPLE - Single UseCase Interface

## 🎯 **KIẾN TRÚC CỰC KỲ ĐỠN GIẢN**

### ✨ **Chỉ còn lại:**
- **1 interface `IUseCase<TInput, TOutput>` duy nhất**
- **4 UseCase implementations đơn giản**
- **Không có BaseUseCase, ValidatedUseCase**
- **Validation inline trong từng UseCase**

### 📁 **Cấu trúc Files Tối Giản**

```
src/core/usecases/
├── base/
│   └── IBaseUseCase.ts          # CHỈ CÓ IUseCase<TInput, TOutput>
└── user/
    ├── CreateUserUseCase.ts     # implements IUseCase trực tiếp
    ├── GetUsersUseCase.ts       # implements IUseCase trực tiếp
    ├── UpdateUserUseCase.ts     # implements IUseCase trực tiếp
    └── DeleteUserUseCase.ts     # implements IUseCase trực tiếp
```

**❌ ĐÃ XÓA TẤT CẢ:**
- `BaseUseCase.ts`
- `ValidatedUseCase.ts` 
- `ICreateUserUseCase.ts`
- `IGetUsersUseCase.ts`
- `IUpdateUserUseCase.ts`
- `IDeleteUserUseCase.ts`
- `types.ts`

### 🔧 **Implementation Cực Đơn Giản**

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
import { injectable, inject } from 'inversify';
import { IUseCase } from '../base/IBaseUseCase';
import { User } from '../../entities/User';

// Simple types inline
type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
type CreateUserOutput = User;

@injectable()
export class CreateUserUseCase implements IUseCase<CreateUserInput, CreateUserOutput> {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(userData: CreateUserInput): Promise<CreateUserOutput> {
    // Simple validation inline
    if (!userData.name || userData.name.trim().length === 0) {
      throw new Error('User name is required');
    }
    
    if (!userData.email || userData.email.trim().length === 0) {
      throw new Error('User email is required');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    // Business logic trực tiếp
    return await this.userRepository.createUser(userData);
  }
}
```

### 🔄 **Flow Đơn Giản Nhất**

```
[Component] 
  ↓ dispatch(createUser(userData))
[Redux Slice] 
  ↓ container.get(TYPES.CreateUserUseCase)
[CreateUserUseCase] 
  ↓ implements IUseCase<CreateUserInput, CreateUserOutput>
  ↓ execute(userData) {
  ↓   validation inline
  ↓   return repository.createUser(userData)
  ↓ }
[UserRepository]
  ↓ createUser(userData)
[Database/API]
  ↓ Return User
[Component]
```

### 📋 **All Use Cases Pattern:**

#### **1. CreateUserUseCase**
```typescript
async execute(userData: CreateUserInput): Promise<CreateUserOutput> {
  // Validation
  if (!userData.name) throw new Error('Name required');
  if (!userData.email) throw new Error('Email required');
  
  // Business logic
  return await this.userRepository.createUser(userData);
}
```

#### **2. GetUsersUseCase**
```typescript
async execute(): Promise<GetUsersOutput> {
  try {
    return await this.userRepository.getUsers();
  } catch (error) {
    console.error('Failed to get users:', error);
    throw error;
  }
}
```

#### **3. UpdateUserUseCase**
```typescript
async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
  // Validation
  if (!input.id) throw new Error('ID required');
  if (!input.userData) throw new Error('Data required');
  
  // Business logic
  return await this.userRepository.updateUser(input.id, input.userData);
}
```

#### **4. DeleteUserUseCase**
```typescript
async execute(id: DeleteUserInput): Promise<DeleteUserOutput> {
  // Validation
  if (!id) throw new Error('ID required');
  
  // Business logic
  await this.userRepository.deleteUser(id);
}
```

### 🎭 **Redux - Cực Đơn Giản**

```typescript
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

### 🎨 **Component - Cực Đơn Giản**

```typescript
const handleSaveUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
  if (editingUser) {
    await dispatch(updateUserAction({ id: editingUser.id, userData }));
  } else {
    await dispatch(createUserAction(userData));
  }
};
```

### ✨ **Lợi Ích Tối Đa**

#### ✅ **1. Ultra Simple**
- **Chỉ 1 interface `IUseCase<TInput, TOutput>`**
- **Không có inheritance phức tạp**
- **Validation inline đơn giản**
- **Business logic trực tiếp**

#### ✅ **2. Maximum Clean**
- **5 files total** (1 interface + 4 implementations)
- **Không có abstract classes**
- **Không có complex patterns**

#### ✅ **3. Easy to Understand**
```typescript
// Ai cũng hiểu ngay
class CreateUserUseCase implements IUseCase<Input, Output> {
  async execute(input) {
    // validate
    // business logic
    // return result
  }
}
```

#### ✅ **4. Easy to Test**
```typescript
// Test đơn giản
const useCase = new CreateUserUseCase(mockRepository);
const result = await useCase.execute(validInput);
expect(result).toEqual(expectedUser);
```

#### ✅ **5. Easy to Extend**
```typescript
// Thêm UseCase mới
class SendEmailUseCase implements IUseCase<EmailInput, EmailOutput> {
  async execute(input: EmailInput): Promise<EmailOutput> {
    // Simple implementation
  }
}
```

### 🎯 **Best Practices**

1. **Keep It Simple**: Không over-engineer
2. **Inline Validation**: Validation trực tiếp trong execute()
3. **Single Responsibility**: Mỗi UseCase làm 1 việc
4. **Error First**: Validate trước, business logic sau
5. **Type Safety**: Dùng TypeScript types cho Input/Output

### 🚀 **Perfect for:**

- ✅ **Small to Medium projects**
- ✅ **Teams muốn simplicity**
- ✅ **Rapid development**
- ✅ **Easy maintenance**
- ✅ **Clear business logic**

### 📝 **Kết Luận**

**Kiến trúc này là HOÀN HẢO vì:**
- 🎯 **Simplest possible**: Không thể đơn giản hơn
- 🔥 **Type Safe**: Vẫn có compile-time checking
- 🧹 **Clean**: Không có code thừa
- 🚀 **Fast**: Dễ implement và maintain
- 💡 **Clear**: Business logic rõ ràng

**Đây chính là cái bạn muốn: 1 UseCase interface đơn giản nhất có thể, no bullshit!** 🎉

### 📊 **Stats:**
- **Files**: 5 total (1 interface + 4 implementations)
- **Lines of Code**: ~20-30 lines per UseCase
- **Complexity**: Minimal
- **Learning Curve**: 5 minutes
- **Maintenance**: Super easy
