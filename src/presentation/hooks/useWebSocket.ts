// Presentation Layer - WebSocket Custom Hook
import { useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { container } from '../../di/container';
import { TYPES } from '../../di/types';
import { WebSocketUseCases } from '../../core/usecases/websocket/WebSocketUseCases';
import { 
  WebSocketMessage,
  WebSocketConnectionFactory 
} from '../../core/entities/websocket/WebSocketConnection';
import {
  connectToTopics,
  subscribeToTopic,
  unsubscribeFromTopic,
  sendMessage,
  disconnectWebSocket,
  addMessage,
  updateConnectionState,
  selectWebSocketMessages,
  selectWebSocketMessagesByTopic,
  selectWebSocketError,
  selectWebSocketIsConnecting,
  selectIsConnectionConnected,
} from '../store/slices/webSocketSlice';

interface UseWebSocketOptions {
  url: string;
  topics: string[];
  userId?: string;
  autoReconnect?: boolean;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: (connectionId: string) => void;
  onDisconnect?: (connectionId: string) => void;
  onError?: (error: string) => void;
}

interface UseWebSocketReturn {
  connectionId: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  messages: WebSocketMessage[];
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  subscribe: (topic: string) => Promise<void>;
  unsubscribe: (topic: string) => Promise<void>;
  sendMessageToTopic: (type: string, topic: string, payload: any) => Promise<void>;
  getMessagesByTopic: (topic: string) => WebSocketMessage[];
  clearError: () => void;
}

export const useWebSocket = (options: UseWebSocketOptions): UseWebSocketReturn => {
  const dispatch = useAppDispatch();
  const connectionIdRef = useRef<string | null>(null);
  const webSocketUseCasesRef = useRef<WebSocketUseCases | null>(null);
  
  // Selectors
  const isConnected = useAppSelector(
    connectionIdRef.current ? selectIsConnectionConnected(connectionIdRef.current) : () => false
  );
  const isConnecting = useAppSelector(selectWebSocketIsConnecting);
  const error = useAppSelector(selectWebSocketError);
  const messages = useAppSelector(selectWebSocketMessages);

  // Initialize WebSocket use cases
  useEffect(() => {
    if (!webSocketUseCasesRef.current) {
      webSocketUseCasesRef.current = container.get<WebSocketUseCases>(TYPES.WebSocketUseCases);
    }
  }, []);

  // Setup event listeners for WebSocket events
  useEffect(() => {
    if (!webSocketUseCasesRef.current || !connectionIdRef.current) return;

    const webSocketUseCases = webSocketUseCasesRef.current;
    const connectionId = connectionIdRef.current;

    // Set up message listener
    const messageListener = (message: WebSocketMessage) => {
      dispatch(addMessage(message));
      options.onMessage?.(message);
    };

    // Set up connection state listener
    const stateListener = () => {
      const updatedConnection = webSocketUseCases.getConnectionStatus(connectionId);
      if (updatedConnection) {
        dispatch(updateConnectionState({ connectionId, connection: updatedConnection }));
        
        // Trigger callbacks based on connection state
        if (WebSocketConnectionFactory.isConnected(updatedConnection)) {
          options.onConnect?.(connectionId);
        } else if (WebSocketConnectionFactory.isDisconnected(updatedConnection)) {
          options.onDisconnect?.(connectionId);
        }
      }
    };

    // Set up error listener
    const errorListener = (errorMsg: string) => {
      options.onError?.(errorMsg);
    };

    // Register listeners
    webSocketUseCases.onMessage(connectionId, messageListener);
    webSocketUseCases.onConnectionStateChange(connectionId, stateListener);
    webSocketUseCases.onError(connectionId, errorListener);

    // Cleanup listeners on unmount or connection change
    return () => {
      webSocketUseCases.removeMessageListener(connectionId, messageListener);
      webSocketUseCases.removeConnectionStateListener(connectionId, stateListener);
      webSocketUseCases.removeErrorListener(connectionId, errorListener);
    };
  }, [connectionIdRef.current, dispatch, options.onMessage, options.onConnect, options.onDisconnect, options.onError]);

  // Connect function
  const connect = useCallback(async () => {
    try {
      const result = await dispatch(connectToTopics({
        url: options.url,
        topics: options.topics,
        userId: options.userId,
        autoReconnect: options.autoReconnect,
      })).unwrap();
      
      connectionIdRef.current = result.connectionId;
    } catch (err: any) {
      console.error('Failed to connect:', err);
      throw err;
    }
  }, [dispatch, options.url, options.topics, options.userId, options.autoReconnect]);

  // Disconnect function
  const disconnect = useCallback(async () => {
    if (!connectionIdRef.current) return;
    
    try {
      await dispatch(disconnectWebSocket(connectionIdRef.current)).unwrap();
      connectionIdRef.current = null;
    } catch (err: any) {
      console.error('Failed to disconnect:', err);
      throw err;
    }
  }, [dispatch]);

  // Subscribe to topic function
  const subscribe = useCallback(async (topic: string) => {
    if (!connectionIdRef.current) {
      throw new Error('Not connected to WebSocket');
    }
    
    try {
      await dispatch(subscribeToTopic({
        connectionId: connectionIdRef.current,
        topic,
      })).unwrap();
    } catch (err: any) {
      console.error('Failed to subscribe to topic:', err);
      throw err;
    }
  }, [dispatch]);

  // Unsubscribe from topic function
  const unsubscribe = useCallback(async (topic: string) => {
    if (!connectionIdRef.current) {
      throw new Error('Not connected to WebSocket');
    }
    
    try {
      await dispatch(unsubscribeFromTopic({
        connectionId: connectionIdRef.current,
        topic,
      })).unwrap();
    } catch (err: any) {
      console.error('Failed to unsubscribe from topic:', err);
      throw err;
    }
  }, [dispatch]);

  // Send message to topic function
  const sendMessageToTopic = useCallback(async (type: string, topic: string, payload: any) => {
    if (!connectionIdRef.current) {
      throw new Error('Not connected to WebSocket');
    }
    
    try {
      await dispatch(sendMessage({
        connectionId: connectionIdRef.current,
        type,
        topic,
        payload,
      })).unwrap();
    } catch (err: any) {
      console.error('Failed to send message:', err);
      throw err;
    }
  }, [dispatch]);

  // Get messages by topic function
  const getMessagesByTopic = useCallback((topic: string) => {
    return selectWebSocketMessagesByTopic(topic)({ websocket: { messages, connections: {}, isConnecting: false, error: null, lastMessageTimestamp: null } });
  }, [messages]);

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: 'websocket/clearError' });
  }, [dispatch]);

  // Auto-connect on mount if specified
  useEffect(() => {
    if (options.autoReconnect !== false && !connectionIdRef.current && !isConnecting) {
      connect().catch(console.error);
    }
  }, [connect, isConnecting, options.autoReconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (connectionIdRef.current) {
        disconnect().catch(console.error);
      }
    };
  }, [disconnect]);

  return {
    connectionId: connectionIdRef.current,
    isConnected,
    isConnecting,
    error,
    messages,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    sendMessageToTopic,
    getMessagesByTopic,
    clearError,
  };
};

// Hook for listening to specific topic
export const useWebSocketTopic = (
  connectionHook: UseWebSocketReturn,
  topic: string,
  onMessage?: (message: WebSocketMessage) => void
) => {
  const messages = connectionHook.getMessagesByTopic(topic);
  
  // Subscribe to topic when hook is used
  useEffect(() => {
    if (connectionHook.isConnected) {
      connectionHook.subscribe(topic).catch(console.error);
    }
  }, [connectionHook.isConnected, topic, connectionHook]);

  // Handle messages for this topic
  useEffect(() => {
    if (messages.length > 0 && onMessage) {
      const latestMessage = messages[messages.length - 1];
      if (latestMessage.topic === topic) {
        onMessage(latestMessage);
      }
    }
  }, [messages, topic, onMessage]);

  const sendTopicMessage = useCallback(
    (type: string, payload: any) => {
      return connectionHook.sendMessageToTopic(type, topic, payload);
    },
    [connectionHook, topic]
  );

  return {
    messages,
    sendMessage: sendTopicMessage,
    isConnected: connectionHook.isConnected,
    error: connectionHook.error,
  };
};
