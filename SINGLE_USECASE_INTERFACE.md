# Single UseCase Interface Architecture

## Concept: MỘT Interface UseCase DUY NHẤT

Thay vì có nhiều interface riêng biệt, chúng ta có **1 interface `IUseCase<TInput, TOutput>` duy nhất** mà tất cả use cases kế thừa.

### 1. Base Interface - CHỈ MỘT CÁI DUY NHẤT

```typescript
// src/core/usecases/base/IBaseUseCase.ts
export interface IUseCase<TInput = void, TOutput = void> {
  execute(input: TInput): Promise<TOutput>;
}
```

**Đây là interface DUY NHẤT mà tất cả use cases kế thừa!**

### 2. Tất cả User Use Cases đều kế thừa IUseCase

#### A. ICreateUserUseCase
```typescript
import { IUseCase } from '../base/IBaseUseCase';

export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateUserOutput = User;

export interface ICreateUserUseCase extends IUseCase<CreateUserInput, CreateUserOutput> {
  // Inherits: execute(input: CreateUserInput): Promise<CreateUserOutput>
}
```

#### B. IGetUsersUseCase
```typescript
import { IUseCase } from '../base/IBaseUseCase';

export type GetUsersInput = void;
export type GetUsersOutput = User[];

export interface IGetUsersUseCase extends IUseCase<GetUsersInput, GetUsersOutput> {
  // Inherits: execute(input: void): Promise<User[]>
}
```

#### C. IUpdateUserUseCase
```typescript
import { IUseCase } from '../base/IBaseUseCase';

export type UpdateUserInput = { id: string; userData: Partial<User> };
export type UpdateUserOutput = User;

export interface IUpdateUserUseCase extends IUseCase<UpdateUserInput, UpdateUserOutput> {
  // Inherits: execute(input: UpdateUserInput): Promise<UpdateUserOutput>
}
```

#### D. IDeleteUserUseCase
```typescript
import { IUseCase } from '../base/IBaseUseCase';

export type DeleteUserInput = string;
export type DeleteUserOutput = void;

export interface IDeleteUserUseCase extends IUseCase<DeleteUserInput, DeleteUserOutput> {
  // Inherits: execute(input: string): Promise<void>
}
```

### 3. Control Input/Output thông qua Generic Types

#### Type Safety hoàn toàn:
```typescript
// ✅ COMPILE-TIME TYPE CHECKING
const createUseCase: ICreateUserUseCase = container.get(TYPES.CreateUserUseCase);

// Input phải đúng type CreateUserInput
const result: User = await createUseCase.execute({
  name: 'John',
  email: 'john@email.com',
  isActive: true
}); // ✅ OK

// ❌ COMPILE ERROR - thiếu fields
await createUseCase.execute({
  name: 'John'
  // Missing: email, isActive
}); // ❌ TypeScript Error!

// ❌ COMPILE ERROR - sai type
await createUseCase.execute('invalid input'); // ❌ TypeScript Error!
```

### 4. Implementation Classes

```typescript
// CreateUserUseCase - có validation
@injectable()
export class CreateUserUseCase extends ValidatedUseCase<CreateUserInput, CreateUserOutput> implements ICreateUserUseCase {
  
  validateInput(userData: CreateUserInput): boolean {
    if (!userData.name) throw new Error('Name required');
    if (!userData.email) throw new Error('Email required');
    return true;
  }

  protected async executeBusinessLogic(userData: CreateUserInput): Promise<CreateUserOutput> {
    return await this.userRepository.createUser(userData);
  }
}

// GetUsersUseCase - không cần validation
@injectable()
export class GetUsersUseCase extends BaseUseCase<GetUsersInput, GetUsersOutput> implements IGetUsersUseCase {
  
  async execute(): Promise<GetUsersOutput> {
    this.logExecution('execute');
    return this.executeWithErrorHandling(
      () => this.userRepository.getUsers(),
      'Failed to get users'
    );
  }
}
```

### 5. DI Container - Type Safe

```typescript
// types.ts
export const TYPES = {
  CreateUserUseCase: Symbol.for('CreateUserUseCase'),
  GetUsersUseCase: Symbol.for('GetUsersUseCase'),
  UpdateUserUseCase: Symbol.for('UpdateUserUseCase'),
  DeleteUserUseCase: Symbol.for('DeleteUserUseCase'),
};

// container.ts
container.bind<ICreateUserUseCase>(TYPES.CreateUserUseCase).to(CreateUserUseCase);
container.bind<IGetUsersUseCase>(TYPES.GetUsersUseCase).to(GetUsersUseCase);
container.bind<IUpdateUserUseCase>(TYPES.UpdateUserUseCase).to(UpdateUserUseCase);
container.bind<IDeleteUserUseCase>(TYPES.DeleteUserUseCase).to(DeleteUserUseCase);
```

### 6. Redux Integration - Fully Typed

```typescript
// usersSlice.ts
export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: CreateUserInput, { rejectWithValue }) => {
    try {
      const useCase = container.get<ICreateUserUseCase>(TYPES.CreateUserUseCase);
      return await useCase.execute(userData); // Type-safe!
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (input: UpdateUserInput, { rejectWithValue }) => {
    try {
      const useCase = container.get<IUpdateUserUseCase>(TYPES.UpdateUserUseCase);
      return await useCase.execute(input); // Type-safe!
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### 7. Component Usage - Fully Typed

```typescript
// UserListScreen.tsx
const handleSaveUser = async (userData: CreateUserInput) => {
  await dispatch(createUserAction(userData)); // Type-safe!
};

const handleUpdateUser = async (id: string, userData: Partial<User>) => {
  await dispatch(updateUserAction({ id, userData })); // Type-safe!
};

const handleDeleteUser = async (id: string) => {
  await dispatch(deleteUserAction(id)); // Type-safe!
};
```

## Lợi ích của Single UseCase Interface:

### ✅ 1. Simplicity
- **1 interface duy nhất** cho tất cả use cases
- Dễ hiểu, dễ maintain
- Consistent structure

### ✅ 2. Full Type Control
```typescript
// Input control
type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateUserInput = { id: string; userData: Partial<User> };
type DeleteUserInput = string;
type GetUsersInput = void;

// Output control  
type CreateUserOutput = User;
type UpdateUserOutput = User;
type DeleteUserOutput = void;
type GetUsersOutput = User[];
```

### ✅ 3. Compile-time Safety
- TypeScript kiểm tra input/output tại compile time
- Không thể pass sai type
- Auto-completion trong IDE

### ✅ 4. Extensibility
```typescript
// Thêm use case mới rất dễ
export type SendEmailInput = { to: string; subject: string; body: string };
export type SendEmailOutput = { messageId: string; status: string };

export interface ISendEmailUseCase extends IUseCase<SendEmailInput, SendEmailOutput> {}

@injectable()
export class SendEmailUseCase extends ValidatedUseCase<SendEmailInput, SendEmailOutput> implements ISendEmailUseCase {
  // Implementation here
}
```

### ✅ 5. Testing
```typescript
// Mock rất dễ
const mockCreateUseCase: jest.Mocked<ICreateUserUseCase> = {
  execute: jest.fn()
};

// Type-safe testing
mockCreateUseCase.execute.mockResolvedValue(expectedUser);
const result = await mockCreateUseCase.execute(validInput);
expect(result).toEqual(expectedUser);
```

## Kết luận

**Đây chính xác là cái bạn muốn:**
- ✅ **1 interface `IUseCase<TInput, TOutput>` duy nhất**
- ✅ **Tất cả use cases kế thừa từ interface này**
- ✅ **Control hoàn toàn input/output thông qua generic types**
- ✅ **Type safety từ presentation → business logic**
- ✅ **Consistent structure cho tất cả use cases**
