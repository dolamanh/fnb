import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../core/entities/User';
import { container } from '../../di/container';
import { TYPES } from '../../di/types';
import type { IGetUsersUseCase } from '../../core/usecases/user/IGetUsersUseCase';
import type { ICreateUserUseCase } from '../../core/usecases/user/ICreateUserUseCase';
import type { IUpdateUserUseCase } from '../../core/usecases/user/IUpdateUserUseCase';
import type { IDeleteUserUseCase } from '../../core/usecases/user/IDeleteUserUseCase';

// State interface
export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

// Async thunks - Business Logic Layer
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

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const createUserUseCase = container.get<ICreateUserUseCase>(TYPES.CreateUserUseCase);
      const newUser = await createUserUseCase.execute(userData);
      return newUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
      console.error('Failed to create user:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }: { id: string; userData: Partial<User> }, { rejectWithValue }) => {
    try {
      const updateUserUseCase = container.get<IUpdateUserUseCase>(TYPES.UpdateUserUseCase);
      const updatedUser = await updateUserUseCase.execute(id, userData);
      return updatedUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
      console.error('Failed to update user:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      const deleteUserUseCase = container.get<IDeleteUserUseCase>(TYPES.DeleteUserUseCase);
      await deleteUserUseCase.execute(id);
      return id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
      console.error('Failed to delete user:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

// Users slice
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
    // Fetch Users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Create User
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users.push(action.payload);
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Update User
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Delete User
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearError, resetUsers } = usersSlice.actions;

// Export reducer
export default usersSlice.reducer;
