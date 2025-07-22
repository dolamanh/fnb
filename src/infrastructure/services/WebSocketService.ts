// Infrastructure Layer - WebSocket Service Implementation
import { injectable } from 'inversify';
import { IWebSocketService } from '../../core/ports/services/IWebSocketService';
import { 
  WebSocketMessage, 
  WebSocketConnection, 
  WebSocketConnectionFactory 
} from '../../core/entities/websocket/WebSocketConnection';

interface WebSocketInstance {
  connection: WebSocketConnection;
  socket: WebSocket | null;
  topics: Set<string>;
  messageCallbacks: ((message: WebSocketMessage) => void)[];
  stateCallbacks: ((connection: WebSocketConnection) => void)[];
  errorCallbacks: ((error: Error, connectionId?: string) => void)[];
  reconnectTimeout?: NodeJS.Timeout;
}

@injectable()
export class WebSocketService implements IWebSocketService {
  private connections: Map<string, WebSocketInstance> = new Map();
  private globalMessageCallbacks: ((message: WebSocketMessage) => void)[] = [];
  private globalStateCallbacks: ((connection: WebSocketConnection) => void)[] = [];
  private globalErrorCallbacks: ((error: Error, connectionId?: string) => void)[] = [];

  async connect(url: string, topics: string[], userId?: string): Promise<WebSocketConnection> {
    const connection = WebSocketConnectionFactory.create(url, topics, userId);
    
    const instance: WebSocketInstance = {
      connection,
      socket: null,
      topics: new Set(topics),
      messageCallbacks: [],
      stateCallbacks: [],
      errorCallbacks: [],
    };

    this.connections.set(connection.id, instance);
    await this.establishConnection(instance);
    
    return instance.connection;
  }

  private async establishConnection(instance: WebSocketInstance): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Update state to connecting
        instance.connection = WebSocketConnectionFactory.updateState(instance.connection, {
          isConnecting: true,
        });
        this.notifyStateChange(instance);

        const socket = new WebSocket(instance.connection.url);

        socket.onopen = () => {
          console.log(`WebSocket connected: ${instance.connection.id}`);
          
          instance.connection = WebSocketConnectionFactory.updateState(instance.connection, {
            isConnected: true,
            isConnecting: false,
            lastConnectedAt: Date.now(),
            reconnectAttempts: 0,
          });
          
          instance.socket = socket;
          this.notifyStateChange(instance);
          
          // Subscribe to initial topics
          instance.topics.forEach(topic => {
            this.sendSubscriptionMessage(instance, topic, 'subscribe');
          });
          
          resolve();
        };

        socket.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(instance, message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
            this.notifyError(new Error('Invalid message format'), instance.connection.id);
          }
        };

        socket.onclose = () => {
          console.log(`WebSocket disconnected: ${instance.connection.id}`);
          
          instance.connection = WebSocketConnectionFactory.updateState(instance.connection, {
            isConnected: false,
            isConnecting: false,
            lastDisconnectedAt: Date.now(),
          });
          
          instance.socket = null;
          this.notifyStateChange(instance);
          
          // Auto-reconnect if enabled and possible
          if (WebSocketConnectionFactory.canReconnect(instance.connection)) {
            this.scheduleReconnect(instance);
          }
        };

        socket.onerror = (error) => {
          console.error(`WebSocket error: ${instance.connection.id}`, error);
          this.notifyError(new Error('WebSocket connection error'), instance.connection.id);
          reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  private scheduleReconnect(instance: WebSocketInstance): void {
    const delay = Math.min(1000 * Math.pow(2, instance.connection.state.reconnectAttempts), 30000);
    
    instance.reconnectTimeout = setTimeout(async () => {
      if (WebSocketConnectionFactory.canReconnect(instance.connection)) {
        console.log(`Attempting to reconnect: ${instance.connection.id}`);
        
        instance.connection = WebSocketConnectionFactory.updateState(instance.connection, {
          reconnectAttempts: instance.connection.state.reconnectAttempts + 1,
        });
        
        try {
          await this.establishConnection(instance);
        } catch (error) {
          console.error('Reconnection failed:', error);
          this.notifyError(new Error('Reconnection failed'), instance.connection.id);
        }
      }
    }, delay);
  }

  private sendSubscriptionMessage(instance: WebSocketInstance, topic: string, action: 'subscribe' | 'unsubscribe'): void {
    if (instance.socket?.readyState === WebSocket.OPEN) {
      const message = {
        type: action,
        topic,
        timestamp: Date.now(),
      };
      
      instance.socket.send(JSON.stringify(message));
    }
  }

  private handleMessage(instance: WebSocketInstance, message: WebSocketMessage): void {
    // Check if this connection should receive this message
    if (WebSocketConnectionFactory.shouldSubscribeToTopic(instance.connection, message.topic)) {
      // Notify local callbacks
      instance.messageCallbacks.forEach(callback => {
        try {
          callback(message);
        } catch (error) {
          console.error('Error in message callback:', error);
        }
      });
      
      // Notify global callbacks
      this.globalMessageCallbacks.forEach(callback => {
        try {
          callback(message);
        } catch (error) {
          console.error('Error in global message callback:', error);
        }
      });
    }
  }

  private notifyStateChange(instance: WebSocketInstance): void {
    // Notify local callbacks
    instance.stateCallbacks.forEach(callback => {
      try {
        callback(instance.connection);
      } catch (error) {
        console.error('Error in state callback:', error);
      }
    });
    
    // Notify global callbacks
    this.globalStateCallbacks.forEach(callback => {
      try {
        callback(instance.connection);
      } catch (error) {
        console.error('Error in global state callback:', error);
      }
    });
  }

  private notifyError(error: Error, connectionId?: string): void {
    const instance = connectionId ? this.connections.get(connectionId) : null;
    
    // Notify local callbacks
    if (instance) {
      instance.errorCallbacks.forEach(callback => {
        try {
          callback(error, connectionId);
        } catch (callbackError) {
          console.error('Error in error callback:', callbackError);
        }
      });
    }
    
    // Notify global callbacks
    this.globalErrorCallbacks.forEach(callback => {
      try {
        callback(error, connectionId);
      } catch (callbackError) {
        console.error('Error in global error callback:', callbackError);
      }
    });
  }

  async disconnect(connectionId: string): Promise<void> {
    const instance = this.connections.get(connectionId);
    if (!instance) {
      throw new Error(`Connection not found: ${connectionId}`);
    }

    // Clear reconnect timeout
    if (instance.reconnectTimeout) {
      clearTimeout(instance.reconnectTimeout);
    }

    // Close socket
    if (instance.socket) {
      instance.socket.close();
    }

    // Remove from connections
    this.connections.delete(connectionId);
  }

  async reconnect(connectionId: string): Promise<void> {
    const instance = this.connections.get(connectionId);
    if (!instance) {
      throw new Error(`Connection not found: ${connectionId}`);
    }

    // Close existing connection
    if (instance.socket) {
      instance.socket.close();
    }

    // Reset reconnect attempts
    instance.connection = WebSocketConnectionFactory.updateState(instance.connection, {
      reconnectAttempts: 0,
    });

    await this.establishConnection(instance);
  }

  async subscribe(connectionId: string, topic: string): Promise<void> {
    const instance = this.connections.get(connectionId);
    if (!instance) {
      throw new Error(`Connection not found: ${connectionId}`);
    }

    instance.topics.add(topic);
    
    // Update connection topics
    instance.connection = WebSocketConnectionFactory.updateTopics(instance.connection, Array.from(instance.topics));

    // Send subscription message if connected
    if (instance.socket?.readyState === WebSocket.OPEN) {
      this.sendSubscriptionMessage(instance, topic, 'subscribe');
    }
  }

  async unsubscribe(connectionId: string, topic: string): Promise<void> {
    const instance = this.connections.get(connectionId);
    if (!instance) {
      throw new Error(`Connection not found: ${connectionId}`);
    }

    instance.topics.delete(topic);
    
    // Update connection topics
    instance.connection = WebSocketConnectionFactory.updateTopics(instance.connection, Array.from(instance.topics));

    // Send unsubscription message if connected
    if (instance.socket?.readyState === WebSocket.OPEN) {
      this.sendSubscriptionMessage(instance, topic, 'unsubscribe');
    }
  }

  async sendMessage<T>(connectionId: string, message: WebSocketMessage<T>): Promise<void> {
    const instance = this.connections.get(connectionId);
    if (!instance) {
      throw new Error(`Connection not found: ${connectionId}`);
    }

    if (!instance.socket || instance.socket.readyState !== WebSocket.OPEN) {
      throw new Error(`Connection not ready: ${connectionId}`);
    }

    instance.socket.send(JSON.stringify(message));
  }

  getConnection(connectionId: string): WebSocketConnection | null {
    const instance = this.connections.get(connectionId);
    return instance ? instance.connection : null;
  }

  getAllConnections(): WebSocketConnection[] {
    return Array.from(this.connections.values()).map(instance => instance.connection);
  }

  isConnected(connectionId: string): boolean {
    const instance = this.connections.get(connectionId);
    return instance ? WebSocketConnectionFactory.isConnected(instance.connection) : false;
  }

  onMessage<T>(callback: (message: WebSocketMessage<T>) => void): void {
    this.globalMessageCallbacks.push(callback as any);
  }

  onConnectionStateChange(callback: (connection: WebSocketConnection) => void): void {
    this.globalStateCallbacks.push(callback);
  }

  onError(callback: (error: Error, connectionId?: string) => void): void {
    this.globalErrorCallbacks.push(callback);
  }

  async cleanup(): Promise<void> {
    // Disconnect all connections
    const connectionIds = Array.from(this.connections.keys());
    await Promise.all(connectionIds.map(id => this.disconnect(id)));
    
    // Clear callbacks
    this.globalMessageCallbacks.length = 0;
    this.globalStateCallbacks.length = 0;
    this.globalErrorCallbacks.length = 0;
  }
}
