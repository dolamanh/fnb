# Base UseCase Architecture Pattern

## Tổng quan
Chúng ta đã refactor toàn bộ Use Cases để kế thừa từ một BaseUseCase duy nhất, giúp:
- **Kiểm soát Input/Output**: Sử dụng generic types để định nghĩa rõ ràng kiểu dữ liệu đầu vào và đầu ra
- **Validation tự động**: Tích hợp validation logic ngay trong base class
- **Error handling thống nhất**: Xử lý lỗi consistent across tất cả use cases
- **Logging và debugging**: Tự động log execution cho development
- **Code reuse**: Giảm thiểu code duplicate

## Cấu trúc Architecture

### 1. Base Interfaces

```typescript
// IBaseUseCase.ts
export interface IBaseUseCase<TInput = void, TOutput = void> {
  execute(input: TInput): Promise<TOutput>;
}

export interface IValidatedUseCase<TInput = void, TOutput = void> extends IBaseUseCase<TInput, TOutput> {
  validateInput(input: TInput): boolean;
}
```

**Giải thích:**
- `TInput`: Generic type cho dữ liệu đầu vào
- `TOutput`: Generic type cho dữ liệu đầu ra
- `IValidatedUseCase`: Mở rộng base với validation capability

### 2. Base Implementation Classes

```typescript
// BaseUseCase.ts
@injectable()
export abstract class BaseUseCase<TInput = void, TOutput = void> implements IBaseUseCase<TInput, TOutput> {
  abstract execute(input: TInput): Promise<TOutput>;
  
  protected async executeWithErrorHandling<T>(
    operation: () => Promise<T>,
    errorMessage: string
  ): Promise<T>
  
  protected logExecution(methodName: string, input?: TInput): void
}

@injectable()
export abstract class ValidatedUseCase<TInput = void, TOutput = void> 
  extends BaseUseCase<TInput, TOutput> 
  implements IValidatedUseCase<TInput, TOutput> {
  
  validateInput(input: TInput): boolean;
  async execute(input: TInput): Promise<TOutput>;
  protected abstract executeBusinessLogic(input: TInput): Promise<TOutput>;
}
```

## 3. Specific Use Case Implementations

### CreateUserUseCase

```typescript
// Interface với typed Input/Output
export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateUserOutput = User;

export interface ICreateUserUseCase extends IValidatedUseCase<CreateUserInput, CreateUserOutput> {}

// Implementation kế thừa ValidatedUseCase
@injectable()
export class CreateUserUseCase extends ValidatedUseCase<CreateUserInput, CreateUserOutput> implements ICreateUserUseCase {
  
  // Override validation logic
  validateInput(userData: CreateUserInput): boolean {
    super.validateInput(userData); // Base validation (null/undefined check)
    
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
    
    return true;
  }

  // Business logic implementation
  protected async executeBusinessLogic(userData: CreateUserInput): Promise<CreateUserOutput> {
    return await this.userRepository.createUser(userData);
  }
}
```

### UpdateUserUseCase

```typescript
// Compound Input type
export type UpdateUserInput = {
  id: string;
  userData: Partial<User>;
};
export type UpdateUserOutput = User;

@injectable()
export class UpdateUserUseCase extends ValidatedUseCase<UpdateUserInput, UpdateUserOutput> {
  
  validateInput(input: UpdateUserInput): boolean {
    super.validateInput(input);
    
    if (!input.id || input.id.trim().length === 0) {
      throw new Error('User ID is required');
    }
    
    if (!input.userData || Object.keys(input.userData).length === 0) {
      throw new Error('User data to update is required');
    }
    
    // Validate email if provided
    if (input.userData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.userData.email)) {
        throw new Error('Invalid email format');
      }
    }
    
    return true;
  }

  protected async executeBusinessLogic(input: UpdateUserInput): Promise<UpdateUserOutput> {
    return await this.userRepository.updateUser(input.id, input.userData);
  }
}
```

### GetUsersUseCase (Simple Case)

```typescript
// Simple case - no input needed
export type GetUsersInput = void;
export type GetUsersOutput = User[];

@injectable()
export class GetUsersUseCase extends BaseUseCase<GetUsersInput, GetUsersOutput> {
  
  async execute(): Promise<GetUsersOutput> {
    this.logExecution('execute');
    
    return this.executeWithErrorHandling(
      async () => {
        return await this.userRepository.getUsers();
      },
      'Failed to get users'
    );
  }
}
```

## 4. Benefits của Architecture này

### A. Type Safety
```typescript
// ✅ Type-safe input/output
const createUseCase: ICreateUserUseCase = container.get(TYPES.CreateUserUseCase);
const user: User = await createUseCase.execute({
  name: 'John',
  email: 'john@email.com',
  isActive: true
});

// ❌ Compile error - missing required fields
await createUseCase.execute({
  name: 'John'
  // Missing email and isActive
});
```

### B. Automatic Validation
```typescript
// Validation xảy ra tự động trong execute()
try {
  await createUseCase.execute({
    name: '',
    email: 'invalid-email',
    isActive: true
  });
} catch (error) {
  // Error: 'User name is required' hoặc 'Invalid email format'
}
```

### C. Consistent Error Handling
```typescript
// Tất cả errors được wrap và log automatic
protected async executeWithErrorHandling<T>(
  operation: () => Promise<T>,
  errorMessage: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error(`${this.constructor.name}: ${errorMessage}`, error);
    throw error instanceof Error ? error : new Error(errorMessage);
  }
}
```

### D. Development Logging
```typescript
// Automatic logging trong development mode
protected logExecution(methodName: string, input?: TInput): void {
  if (__DEV__) {
    console.log(`[${this.constructor.name}] ${methodName}`, input ? { input } : '');
  }
}

// Output:
// [CreateUserUseCase] execute { input: { name: 'John', email: 'john@email.com', isActive: true } }
```

## 5. Redux Integration

```typescript
// Redux slice sử dụng typed inputs
export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: CreateUserInput, { rejectWithValue }) => {
    try {
      const createUserUseCase = container.get<ICreateUserUseCase>(TYPES.CreateUserUseCase);
      const newUser = await createUserUseCase.execute(userData); // Type-safe call
      return newUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Component usage với proper typing
const handleSaveUser = async (userData: CreateUserInput) => {
  await dispatch(createUserAction(userData));
};
```

## 6. Extensibility

### Thêm Use Case mới:
```typescript
// 1. Define types
export type SendEmailInput = {
  to: string;
  subject: string;
  body: string;
};
export type SendEmailOutput = {
  messageId: string;
  status: 'sent' | 'failed';
};

// 2. Define interface
export interface ISendEmailUseCase extends IValidatedUseCase<SendEmailInput, SendEmailOutput> {}

// 3. Implement
@injectable()
export class SendEmailUseCase extends ValidatedUseCase<SendEmailInput, SendEmailOutput> implements ISendEmailUseCase {
  
  validateInput(input: SendEmailInput): boolean {
    super.validateInput(input);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.to)) {
      throw new Error('Invalid email address');
    }
    
    if (!input.subject || input.subject.trim().length === 0) {
      throw new Error('Email subject is required');
    }
    
    return true;
  }

  protected async executeBusinessLogic(input: SendEmailInput): Promise<SendEmailOutput> {
    // Business logic here
    return { messageId: 'msg-123', status: 'sent' };
  }
}
```

## 7. Testing Benefits

```typescript
// Easy to mock và test với typed interfaces
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockRepository = createMockUserRepository();
    useCase = new CreateUserUseCase(mockRepository);
  });

  it('should validate input correctly', () => {
    expect(() => useCase.validateInput({
      name: '',
      email: 'john@email.com',
      isActive: true
    })).toThrow('User name is required');
  });

  it('should create user successfully', async () => {
    const input: CreateUserInput = {
      name: 'John',
      email: 'john@email.com',
      isActive: true
    };
    
    const expected: User = { ...input, id: '1', createdAt: new Date(), updatedAt: new Date() };
    mockRepository.createUser.mockResolvedValue(expected);

    const result = await useCase.execute(input);
    
    expect(result).toEqual(expected);
    expect(mockRepository.createUser).toHaveBeenCalledWith(input);
  });
});
```

## Kết luận

Architecture này mang lại:
- **Type Safety**: Compile-time checking cho input/output
- **Consistency**: Tất cả use cases follow cùng pattern
- **Maintainability**: Dễ maintain và extend
- **Testability**: Dễ test với clear interfaces
- **Developer Experience**: Auto-completion, validation, logging
- **Clean Code**: Separation of concerns rõ ràng

Mỗi Use Case bây giờ chỉ cần focus vào business logic cụ thể, còn validation, error handling, logging đều được handle bởi base classes.
