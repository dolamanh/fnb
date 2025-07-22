// Core Layer - WebSocket Connection Entity
export interface WebSocketMessage<T = any> {
  id: string;
  type: string;
  topic: string;
  payload: T;
  timestamp: number;
  userId?: string;
}

export interface WebSocketConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  lastConnectedAt?: number;
  lastDisconnectedAt?: number;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
}

export interface WebSocketConnection {
  readonly id: string;
  readonly url: string;
  readonly topics: string[];
  readonly state: WebSocketConnectionState;
  readonly userId?: string;
}

export const WebSocketConnectionFactory = {
  create(
    url: string,
    topics: string[],
    userId?: string
  ): WebSocketConnection {
    return {
      id: `ws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url,
      topics,
      state: {
        isConnected: false,
        isConnecting: false,
        reconnectAttempts: 0,
        maxReconnectAttempts: 5,
      },
      userId,
    };
  },

  isConnected(connection: WebSocketConnection): boolean {
    return connection.state.isConnected;
  },

  isDisconnected(connection: WebSocketConnection): boolean {
    return !connection.state.isConnected && !connection.state.isConnecting;
  },

  canReconnect(connection: WebSocketConnection): boolean {
    return connection.state.reconnectAttempts < connection.state.maxReconnectAttempts;
  },

  shouldSubscribeToTopic(connection: WebSocketConnection, topic: string): boolean {
    return connection.topics.includes(topic) || connection.topics.includes('*');
  },

  updateState(
    connection: WebSocketConnection, 
    stateUpdate: Partial<WebSocketConnectionState>
  ): WebSocketConnection {
    return {
      ...connection,
      state: {
        ...connection.state,
        ...stateUpdate,
      },
    };
  },

  updateTopics(connection: WebSocketConnection, topics: string[]): WebSocketConnection {
    return {
      ...connection,
      topics,
    };
  },
};
