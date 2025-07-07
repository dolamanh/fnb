import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';

// Configure Redux Store
export const store = configureStore({
  reducer: {
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for Date objects in User entity
        ignoredActions: ['users/createUser/fulfilled', 'users/updateUser/fulfilled', 'users/fetchUsers/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['payload.createdAt', 'payload.updatedAt'],
        // Ignore these paths in the state
        ignoredPaths: ['users.users'],
      },
    }),
  devTools: __DEV__,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
