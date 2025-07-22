// Presentation Layer - WebSocket Test Screen
import React, { useState, useCallback } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { useWebSocket } from '../hooks/useWebSocket';
import { BaseText } from '../components/base/BaseText';
import { BaseButton } from '../components/base/BaseButton';
import { BaseInput } from '../components/base/BaseInput';
import { BaseCard } from '../components/base/BaseCard';
import { BaseLoading } from '../components/base/BaseLoading';
import { useTranslation } from '../i18n/hooks';
import { WebSocketMessage } from '../../core/entities/websocket/WebSocketConnection';

export const WebSocketTestScreen: React.FC = () => {
  const { t } = useTranslation();
  const [serverUrl, setServerUrl] = useState('ws://localhost:8080');
  const [newTopic, setNewTopic] = useState('');
  const [messageType, setMessageType] = useState('chat');
  const [messagePayload, setMessagePayload] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('general');

  // WebSocket connection hook
  const webSocket = useWebSocket({
    url: serverUrl,
    topics: ['general', 'notifications'], // Initial topics
    userId: 'user-123',
    autoReconnect: true,
    onMessage: (message: WebSocketMessage) => {
      console.log('Received message:', message);
    },
    onConnect: (connectionId: string) => {
      Alert.alert('Connected', `WebSocket connected with ID: ${connectionId}`);
    },
    onDisconnect: (connectionId: string) => {
      Alert.alert('Disconnected', `WebSocket disconnected: ${connectionId}`);
    },
    onError: (error: string) => {
      Alert.alert('WebSocket Error', error);
    },
  });

  const handleConnect = useCallback(async () => {
    try {
      await webSocket.connect();
    } catch (error: any) {
      Alert.alert('Connection Error', error.message);
    }
  }, [webSocket]);

  const handleDisconnect = useCallback(async () => {
    try {
      await webSocket.disconnect();
    } catch (error: any) {
      Alert.alert('Disconnect Error', error.message);
    }
  }, [webSocket]);

  const handleSubscribeToTopic = useCallback(async () => {
    if (!newTopic.trim()) {
      Alert.alert('Error', 'Please enter a topic name');
      return;
    }

    try {
      await webSocket.subscribe(newTopic.trim());
      setNewTopic('');
      Alert.alert('Success', `Subscribed to topic: ${newTopic}`);
    } catch (error: any) {
      Alert.alert('Subscribe Error', error.message);
    }
  }, [webSocket, newTopic]);

  const handleUnsubscribeFromTopic = useCallback(async () => {
    if (!newTopic.trim()) {
      Alert.alert('Error', 'Please enter a topic name');
      return;
    }

    try {
      await webSocket.unsubscribe(newTopic.trim());
      setNewTopic('');
      Alert.alert('Success', `Unsubscribed from topic: ${newTopic}`);
    } catch (error: any) {
      Alert.alert('Unsubscribe Error', error.message);
    }
  }, [webSocket, newTopic]);

  const handleSendMessage = useCallback(async () => {
    if (!messagePayload.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    try {
      await webSocket.sendMessageToTopic(
        messageType,
        selectedTopic,
        { text: messagePayload, timestamp: Date.now() }
      );
      setMessagePayload('');
      Alert.alert('Success', 'Message sent successfully');
    } catch (error: any) {
      Alert.alert('Send Error', error.message);
    }
  }, [webSocket, messageType, selectedTopic, messagePayload]);

  const handleClearError = useCallback(() => {
    webSocket.clearError();
  }, [webSocket]);

  const renderConnectionStatus = () => (
    <BaseCard style={{ marginBottom: 16 }}>
      <BaseText variant="h3" style={{ marginBottom: 8 }}>
        {t('websocket.connectionStatus')}
      </BaseText>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <BaseText variant="body2">Status: </BaseText>
        <BaseText 
          variant="body2" 
          weight="bold"
          color={webSocket.isConnected ? 'success' : 
                 webSocket.isConnecting ? 'warning' : 'error'}
        >
          {webSocket.isConnected ? 'Connected' : 
           webSocket.isConnecting ? 'Connecting...' : 'Disconnected'}
        </BaseText>
      </View>

      {webSocket.connectionId && (
        <BaseText variant="caption" style={{ marginBottom: 8 }}>
          Connection ID: {webSocket.connectionId}
        </BaseText>
      )}

      {webSocket.error && (
        <View style={{ marginTop: 8 }}>
          <BaseText variant="body2" color="error" style={{ marginBottom: 4 }}>
            Error: {webSocket.error}
          </BaseText>
          <BaseButton 
            title="Clear Error" 
            onPress={handleClearError}
            variant="outline"
            size="small"
          />
        </View>
      )}
    </BaseCard>
  );

  const renderConnectionControls = () => (
    <BaseCard style={{ marginBottom: 16 }}>
      <BaseText variant="h3" style={{ marginBottom: 8 }}>
        {t('websocket.connectionControls')}
      </BaseText>

      <BaseInput
        label="Server URL"
        value={serverUrl}
        onChangeText={setServerUrl}
        placeholder="ws://localhost:8080"
        containerStyle={{ marginBottom: 12 }}
        editable={!webSocket.isConnected}
      />

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <BaseButton
          title={webSocket.isConnected ? "Disconnect" : "Connect"}
          onPress={webSocket.isConnected ? handleDisconnect : handleConnect}
          disabled={webSocket.isConnecting}
          variant={webSocket.isConnected ? "outline" : "primary"}
          style={{ flex: 1 }}
        />
      </View>
    </BaseCard>
  );

  const renderTopicControls = () => (
    <BaseCard style={{ marginBottom: 16 }}>
      <BaseText variant="h3" style={{ marginBottom: 8 }}>
        {t('websocket.topicManagement')}
      </BaseText>

      <BaseInput
        label="Topic Name"
        value={newTopic}
        onChangeText={setNewTopic}
        placeholder="Enter topic name"
        containerStyle={{ marginBottom: 12 }}
        editable={webSocket.isConnected}
      />

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        <BaseButton
          title="Subscribe"
          onPress={handleSubscribeToTopic}
          disabled={!webSocket.isConnected || !newTopic.trim()}
          variant="primary"
          style={{ flex: 1 }}
        />
        <BaseButton
          title="Unsubscribe"
          onPress={handleUnsubscribeFromTopic}
          disabled={!webSocket.isConnected || !newTopic.trim()}
          variant="outline"
          style={{ flex: 1 }}
        />
      </View>
    </BaseCard>
  );

  const renderMessageControls = () => (
    <BaseCard style={{ marginBottom: 16 }}>
      <BaseText variant="h3" style={{ marginBottom: 8 }}>
        {t('websocket.sendMessage')}
      </BaseText>

      <BaseInput
        label="Message Type"
        value={messageType}
        onChangeText={setMessageType}
        placeholder="chat, notification, etc."
        containerStyle={{ marginBottom: 12 }}
        editable={webSocket.isConnected}
      />

      <BaseInput
        label="Target Topic"
        value={selectedTopic}
        onChangeText={setSelectedTopic}
        placeholder="general, notifications, etc."
        containerStyle={{ marginBottom: 12 }}
        editable={webSocket.isConnected}
      />

      <BaseInput
        label="Message"
        value={messagePayload}
        onChangeText={setMessagePayload}
        placeholder="Enter your message"
        multiline
        numberOfLines={3}
        containerStyle={{ marginBottom: 12 }}
        editable={webSocket.isConnected}
      />

      <BaseButton
        title="Send Message"
        onPress={handleSendMessage}
        disabled={!webSocket.isConnected || !messagePayload.trim()}
        variant="primary"
      />
    </BaseCard>
  );

  const renderMessages = () => (
    <BaseCard>
      <BaseText variant="h3" style={{ marginBottom: 8 }}>
        Recent Messages ({webSocket.messages.length})
      </BaseText>

      {webSocket.messages.length === 0 ? (
        <BaseText variant="body2" style={{ textAlign: 'center', padding: 16, color: '#666' }}>
          No messages received yet
        </BaseText>
      ) : (
        <ScrollView style={{ maxHeight: 300 }}>
          {webSocket.messages.slice(-10).map((message, index) => (
            <View 
              key={`${message.id}-${index}`} 
              style={{ 
                padding: 8, 
                marginBottom: 8, 
                backgroundColor: '#f5f5f5', 
                borderRadius: 8 
              }}
            >
              <BaseText variant="caption" style={{ color: '#666', marginBottom: 4 }}>
                {new Date(message.timestamp).toLocaleTimeString()} • {message.topic} • {message.type}
              </BaseText>
              <BaseText variant="body2">
                {typeof message.payload === 'string' 
                  ? message.payload 
                  : JSON.stringify(message.payload, null, 2)}
              </BaseText>
            </View>
          ))}
        </ScrollView>
      )}
    </BaseCard>
  );

  if (webSocket.isConnecting) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <BaseLoading size="large" />
        <BaseText variant="body1" style={{ marginTop: 16 }}>
          Connecting to WebSocket...
        </BaseText>
      </View>
    );
  }

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#fff' }} 
      contentContainerStyle={{ padding: 16 }}
    >
      <BaseText variant="h1" style={{ marginBottom: 16, textAlign: 'center' }}>
        {t('websocket.testTitle')}
      </BaseText>

      {renderConnectionStatus()}
      {renderConnectionControls()}
      {renderTopicControls()}
      {renderMessageControls()}
      {renderMessages()}
    </ScrollView>
  );
};
