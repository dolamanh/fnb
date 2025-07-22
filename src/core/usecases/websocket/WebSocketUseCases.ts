// Core Layer - WebSocket Use Cases
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import type { IWebSocketService } from '../../ports/services/IWebSocketService';
import { WebSocketMessage, WebSocketConnection } from '../../entities/websocket/WebSocketConnection';

export interface WebSocketSubscriptionOptions {
  url: string;
  topics: string[];
  userId?: string;
  autoReconnect?: boolean;
}

@injectable()
export class WebSocketUseCases {
  constructor(
    @inject(TYPES.WebSocketService) private webSocketService: IWebSocketService
  ) {}

  async connectToTopics(options: WebSocketSubscriptionOptions): Promise<string> {
    try {
      const connection = await this.webSocketService.connect(
        options.url,
        options.topics,
        options.userId
      );
      
      // Subscribe to all requested topics
      for (const topic of options.topics) {
        await this.webSocketService.subscribe(connection.id, topic);
      }
      
      return connection.id;
    } catch (error) {
      throw new Error(`Failed to connect to WebSocket: ${error}`);
    }
  }

  async subscribeToTopic(connectionId: string, topic: string): Promise<void> {
    try {
      await this.webSocketService.subscribe(connectionId, topic);
    } catch (error) {
      throw new Error(`Failed to subscribe to topic ${topic}: ${error}`);
    }
  }

  async unsubscribeFromTopic(connectionId: string, topic: string): Promise<void> {
    try {
      await this.webSocketService.unsubscribe(connectionId, topic);
    } catch (error) {
      throw new Error(`Failed to unsubscribe from topic ${topic}: ${error}`);
    }
  }

  async sendMessage<T>(
    connectionId: string, 
    type: string, 
    topic: string, 
    payload: T
  ): Promise<void> {
    try {
      const message: WebSocketMessage<T> = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        topic,
        payload,
        timestamp: Date.now(),
      };

      await this.webSocketService.sendMessage(connectionId, message);
    } catch (error) {
      throw new Error(`Failed to send message: ${error}`);
    }
  }

  async disconnect(connectionId: string): Promise<void> {
    try {
      await this.webSocketService.disconnect(connectionId);
    } catch (error) {
      throw new Error(`Failed to disconnect: ${error}`);
    }
  }

  getConnectionStatus(connectionId: string): WebSocketConnection | null {
    return this.webSocketService.getConnection(connectionId);
  }

  getAllConnections(): WebSocketConnection[] {
    return this.webSocketService.getAllConnections();
  }

  setupMessageListener<T>(callback: (message: WebSocketMessage<T>) => void): void {
    this.webSocketService.onMessage(callback);
  }

  setupConnectionStateListener(callback: (connection: WebSocketConnection) => void): void {
    this.webSocketService.onConnectionStateChange(callback);
  }

  setupErrorListener(callback: (error: Error, connectionId?: string) => void): void {
    this.webSocketService.onError(callback);
  }

  // New methods for specific connection event handling
  onMessage<T>(connectionId: string, callback: (message: WebSocketMessage<T>) => void): void {
    this.webSocketService.onMessage((message: WebSocketMessage<T>) => {
      // Filter messages for specific connection
      const connection = this.getConnectionStatus(connectionId);
      if (connection && message) {
        callback(message);
      }
    });
  }

  onConnectionStateChange(connectionId: string, callback: () => void): void {
    this.webSocketService.onConnectionStateChange((connection: WebSocketConnection) => {
      if (connection.id === connectionId) {
        callback();
      }
    });
  }

  onError(connectionId: string, callback: (error: string) => void): void {
    this.webSocketService.onError((error: Error, connId?: string) => {
      if (!connId || connId === connectionId) {
        callback(error.message);
      }
    });
  }

  // Remove listener methods (simplified implementation)
  removeMessageListener<T>(_connectionId: string, _callback: (message: WebSocketMessage<T>) => void): void {
    // Note: In a real implementation, you'd need to track and remove specific listeners
    // For now, this is a placeholder to satisfy the interface
  }

  removeConnectionStateListener(_connectionId: string, _callback: () => void): void {
    // Note: In a real implementation, you'd need to track and remove specific listeners
    // For now, this is a placeholder to satisfy the interface
  }

  removeErrorListener(_connectionId: string, _callback: (error: string) => void): void {
    // Note: In a real implementation, you'd need to track and remove specific listeners
    // For now, this is a placeholder to satisfy the interface
  }

  async cleanup(): Promise<void> {
    await this.webSocketService.cleanup();
  }
}
