```
┌─────────────────────────────────────────────────────────────────┐
│                     SINGLE USECASE INTERFACE                   │
│                          ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    IUseCase<TInput, TOutput>                    │
│                        [INTERFACE DUY NHẤT]                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  execute(input: TInput): Promise<TOutput>               │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                   ▲
                                   │ extends
                  ┌────────────────┼────────────────┐
                  │                │                │
                  ▼                ▼                ▼
    ┌─────────────────────┐ ┌─────────────────┐ ┌─────────────────┐
    │  ICreateUserUseCase │ │ IGetUsersUseCase│ │ IUpdateUserUseCase│
    │                     │ │                 │ │                 │
    │ Input: CreateUser   │ │ Input: void     │ │ Input: Update   │
    │ Output: User        │ │ Output: User[]  │ │ Output: User    │
    └─────────────────────┘ └─────────────────┘ └─────────────────┘
                  ▲                ▲                ▲
                  │ implements     │ implements     │ implements
                  ▼                ▼                ▼
    ┌─────────────────────┐ ┌─────────────────┐ ┌─────────────────┐
    │ CreateUserUseCase   │ │ GetUsersUseCase │ │ UpdateUserUseCase│
    │                     │ │                 │ │                 │
    │ extends             │ │ extends         │ │ extends         │
    │ ValidatedUseCase    │ │ BaseUseCase     │ │ ValidatedUseCase│
    └─────────────────────┘ └─────────────────┘ └─────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      TYPE CONTROL EXAMPLE                      │
└─────────────────────────────────────────────────────────────────┘

// 1. CREATE USER
export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateUserOutput = User;

export interface ICreateUserUseCase extends IUseCase<CreateUserInput, CreateUserOutput> {}

// USAGE:
const useCase: ICreateUserUseCase = container.get(TYPES.CreateUserUseCase);
const user: User = await useCase.execute({
  name: 'John',
  email: 'john@email.com', 
  isActive: true
}); // ✅ Type Safe!

// ❌ COMPILE ERROR:
await useCase.execute({ name: 'John' }); // Missing email, isActive
await useCase.execute('invalid');        // Wrong type

┌─────────────────────────────────────────────────────────────────┐
│                       FLOW DIAGRAM                             │
└─────────────────────────────────────────────────────────────────┘

[Component] 
    │ dispatch(createUser(userData: CreateUserInput))
    ▼
[Redux Slice] 
    │ container.get<ICreateUserUseCase>(TYPES.CreateUserUseCase)
    ▼
[CreateUserUseCase] 
    │ implements IUseCase<CreateUserInput, CreateUserOutput>
    │ extends ValidatedUseCase<CreateUserInput, CreateUserOutput>
    ▼
[ValidatedUseCase]
    │ 1. validateInput(userData: CreateUserInput)
    │ 2. executeBusinessLogic(userData: CreateUserInput)
    ▼
[UserRepository]
    │ createUser(userData: CreateUserInput): Promise<User>
    ▼
[Database/API]
    │ Return User
    ▼
[Component] 
    │ state.users updated with new User
    
┌─────────────────────────────────────────────────────────────────┐
│                     BENEFITS SUMMARY                           │
└─────────────────────────────────────────────────────────────────┘

✅ Single Interface: Chỉ 1 IUseCase<TInput, TOutput> cho tất cả
✅ Type Control: Kiểm soát hoàn toàn input/output types
✅ Compile Safety: TypeScript check tại compile time
✅ Consistency: Tất cả use cases có cùng structure
✅ Extensibility: Dễ thêm use case mới
✅ Testability: Dễ mock và test
✅ Maintainability: Code clean và dễ maintain

┌─────────────────────────────────────────────────────────────────┐
│                    IMPLEMENTATION PATTERN                      │
└─────────────────────────────────────────────────────────────────┘

// Step 1: Define Types
export type [Operation]Input = [InputType];
export type [Operation]Output = [OutputType];

// Step 2: Define Interface (extends IUseCase)
export interface I[Operation]UseCase extends IUseCase<[Operation]Input, [Operation]Output> {}

// Step 3: Implement Class
@injectable()
export class [Operation]UseCase extends [BaseUseCase|ValidatedUseCase] implements I[Operation]UseCase {
  async execute(input: [Operation]Input): Promise<[Operation]Output> {
    // Business logic here
  }
}

// Step 4: Register in DI
container.bind<I[Operation]UseCase>(TYPES.[Operation]UseCase).to([Operation]UseCase);

// Step 5: Use in Redux
const useCase = container.get<I[Operation]UseCase>(TYPES.[Operation]UseCase);
const result = await useCase.execute(typedInput);
```
