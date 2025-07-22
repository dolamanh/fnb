import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import cartsReducer from './slices/cartsSlice';
import webSocketReducer from './slices/webSocketSlice';

// Configure Redux Store
export const store = configureStore({
  reducer: {
    users: usersReducer,
    carts: cartsReducer,
    websocket: webSocketReducer, // Add WebSocket slice reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'users/getUsers/fulfilled', 
          'carts/getCarts/fulfilled',
          'websocket/connectToTopics/fulfilled',
          'websocket/subscribeToTopic/fulfilled',
          'websocket/addMessage',
        ],
        ignoredPaths: [
          'users.users', 
          'carts.carts',
          'websocket.connections',
          'websocket.messages',
        ],
      },
    }),
  devTools: __DEV__,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
