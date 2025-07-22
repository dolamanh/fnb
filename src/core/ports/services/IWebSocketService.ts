// Core Layer - WebSocket Service Port
import { WebSocketMessage, WebSocketConnection } from '../../entities/websocket/WebSocketConnection';

export interface IWebSocketService {
  // Connection Management
  connect(url: string, topics: string[], userId?: string): Promise<WebSocketConnection>;
  disconnect(connectionId: string): Promise<void>;
  reconnect(connectionId: string): Promise<void>;
  
  // Topic Management
  subscribe(connectionId: string, topic: string): Promise<void>;
  unsubscribe(connectionId: string, topic: string): Promise<void>;
  
  // Message Handling
  sendMessage<T>(connectionId: string, message: WebSocketMessage<T>): Promise<void>;
  
  // Status
  getConnection(connectionId: string): WebSocketConnection | null;
  getAllConnections(): WebSocketConnection[];
  isConnected(connectionId: string): boolean;
  
  // Event Listeners
  onMessage<T>(callback: (message: WebSocketMessage<T>) => void): void;
  onConnectionStateChange(callback: (connection: WebSocketConnection) => void): void;
  onError(callback: (error: Error, connectionId?: string) => void): void;
  
  // Cleanup
  cleanup(): Promise<void>;
}
