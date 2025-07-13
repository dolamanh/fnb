import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import cartsReducer from './slices/cartsSlice';

// Configure Redux Store
export const store = configureStore({
  reducer: {
    users: usersReducer,
    carts: cartsReducer, // Add carts slice reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['users/getUsers/fulfilled', 'carts/getCarts/fulfilled'],
        ignoredPaths: ['users.users', 'carts.carts'],
      },
    }),
  devTools: __DEV__,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
