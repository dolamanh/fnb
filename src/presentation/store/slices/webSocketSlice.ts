// Presentation Layer - WebSocket Redux Slice
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { container } from '../../../di/container';
import { TYPES } from '../../../di/types';
import { WebSocketUseCases } from '../../../core/usecases/websocket/WebSocketUseCases';
import { 
  WebSocketConnection, 
  WebSocketMessage,
  WebSocketConnectionFactory 
} from '../../../core/entities/websocket/WebSocketConnection';

interface WebSocketConnectionState {
  connections: Record<string, WebSocketConnection>;
  messages: WebSocketMessage[];
  isConnecting: boolean;
  error: string | null;
  lastMessageTimestamp: number | null;
}

const initialState: WebSocketConnectionState = {
  connections: {},
  messages: [],
  isConnecting: false,
  error: null,
  lastMessageTimestamp: null,
};

interface ConnectToTopicsPayload {
  url: string;
  topics: string[];
  userId?: string;
  autoReconnect?: boolean;
}

interface SubscribeToTopicPayload {
  connectionId: string;
  topic: string;
}

interface SendMessagePayload {
  connectionId: string;
  type: string;
  topic: string;
  payload: any;
}

// Async Thunks
export const connectToTopics = createAsyncThunk(
  'websocket/connectToTopics',
  async (payload: ConnectToTopicsPayload, { rejectWithValue }) => {
    try {
      const webSocketUseCases = container.get<WebSocketUseCases>(TYPES.WebSocketUseCases);
      const connectionId = await webSocketUseCases.connectToTopics({
        url: payload.url,
        topics: payload.topics,
        userId: payload.userId,
        autoReconnect: payload.autoReconnect ?? true,
      });
      
      const connection = webSocketUseCases.getConnectionStatus(connectionId);
      return { connectionId, connection };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to connect to WebSocket');
    }
  }
);

export const subscribeToTopic = createAsyncThunk(
  'websocket/subscribeToTopic',
  async (payload: SubscribeToTopicPayload, { rejectWithValue }) => {
    try {
      const webSocketUseCases = container.get<WebSocketUseCases>(TYPES.WebSocketUseCases);
      await webSocketUseCases.subscribeToTopic(payload.connectionId, payload.topic);
      
      const connection = webSocketUseCases.getConnectionStatus(payload.connectionId);
      return { connectionId: payload.connectionId, connection };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to subscribe to topic');
    }
  }
);

export const unsubscribeFromTopic = createAsyncThunk(
  'websocket/unsubscribeFromTopic',
  async (payload: SubscribeToTopicPayload, { rejectWithValue }) => {
    try {
      const webSocketUseCases = container.get<WebSocketUseCases>(TYPES.WebSocketUseCases);
      await webSocketUseCases.unsubscribeFromTopic(payload.connectionId, payload.topic);
      
      const connection = webSocketUseCases.getConnectionStatus(payload.connectionId);
      return { connectionId: payload.connectionId, connection };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to unsubscribe from topic');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'websocket/sendMessage',
  async (payload: SendMessagePayload, { rejectWithValue }) => {
    try {
      const webSocketUseCases = container.get<WebSocketUseCases>(TYPES.WebSocketUseCases);
      await webSocketUseCases.sendMessage(
        payload.connectionId,
        payload.type,
        payload.topic,
        payload.payload
      );
      return payload;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send message');
    }
  }
);

export const disconnectWebSocket = createAsyncThunk(
  'websocket/disconnect',
  async (connectionId: string, { rejectWithValue }) => {
    try {
      const webSocketUseCases = container.get<WebSocketUseCases>(TYPES.WebSocketUseCases);
      await webSocketUseCases.disconnect(connectionId);
      return connectionId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to disconnect');
    }
  }
);

// WebSocket Slice
const webSocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<WebSocketMessage>) => {
      state.messages.push(action.payload);
      state.lastMessageTimestamp = action.payload.timestamp;
      
      // Keep only last 100 messages to prevent memory issues
      if (state.messages.length > 100) {
        state.messages = state.messages.slice(-100);
      }
    },
    
    updateConnectionState: (state, action: PayloadAction<{ connectionId: string; connection: WebSocketConnection }>) => {
      const { connectionId, connection } = action.payload;
      state.connections[connectionId] = connection;
    },
    
    clearMessages: (state) => {
      state.messages = [];
      state.lastMessageTimestamp = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    removeConnection: (state, action: PayloadAction<string>) => {
      delete state.connections[action.payload];
    },
  },
  extraReducers: (builder) => {
    // Connect to topics
    builder
      .addCase(connectToTopics.pending, (state) => {
        state.isConnecting = true;
        state.error = null;
      })
      .addCase(connectToTopics.fulfilled, (state, action) => {
        state.isConnecting = false;
        if (action.payload.connection) {
          state.connections[action.payload.connectionId] = action.payload.connection;
        }
      })
      .addCase(connectToTopics.rejected, (state, action) => {
        state.isConnecting = false;
        state.error = action.payload as string;
      });

    // Subscribe to topic
    builder
      .addCase(subscribeToTopic.fulfilled, (state, action) => {
        if (action.payload.connection) {
          state.connections[action.payload.connectionId] = action.payload.connection;
        }
      })
      .addCase(subscribeToTopic.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Unsubscribe from topic
    builder
      .addCase(unsubscribeFromTopic.fulfilled, (state, action) => {
        if (action.payload.connection) {
          state.connections[action.payload.connectionId] = action.payload.connection;
        }
      })
      .addCase(unsubscribeFromTopic.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Send message
    builder
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Disconnect
    builder
      .addCase(disconnectWebSocket.fulfilled, (state, action) => {
        delete state.connections[action.payload];
      })
      .addCase(disconnectWebSocket.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  addMessage,
  updateConnectionState,
  clearMessages,
  clearError,
  removeConnection,
} = webSocketSlice.actions;

export default webSocketSlice.reducer;

// Selectors
export const selectWebSocketConnections = (state: { websocket: WebSocketConnectionState }) => 
  state.websocket.connections;

export const selectWebSocketConnection = (connectionId: string) => 
  (state: { websocket: WebSocketConnectionState }) => 
    state.websocket.connections[connectionId];

export const selectWebSocketMessages = (state: { websocket: WebSocketConnectionState }) => 
  state.websocket.messages;

export const selectWebSocketMessagesByTopic = (topic: string) => 
  (state: { websocket: WebSocketConnectionState }) => 
    state.websocket.messages.filter(msg => msg.topic === topic);

export const selectWebSocketError = (state: { websocket: WebSocketConnectionState }) => 
  state.websocket.error;

export const selectWebSocketIsConnecting = (state: { websocket: WebSocketConnectionState }) => 
  state.websocket.isConnecting;

export const selectIsConnectionConnected = (connectionId: string) => 
  (state: { websocket: WebSocketConnectionState }) => {
    const connection = state.websocket.connections[connectionId];
    return connection ? WebSocketConnectionFactory.isConnected(connection) : false;
  };
