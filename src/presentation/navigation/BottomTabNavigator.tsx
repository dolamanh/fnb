// Presentation Layer - Bottom Tab Navigator
import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from './types';
import { MainScreen } from '../screens/MainScreen';
import { UserListScreen } from '../screens/UserListScreen';
import { WebSocketTestScreen } from '../screens/WebSocketTestScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useTranslation } from '../i18n/hooks';

const Tab = createBottomTabNavigator<BottomTabParamList>();

// Simple icon component as placeholder - moved outside component
const TabIcon: React.FC<{ name: string; color: string; size: number }> = ({ name, color, size }) => {
  // For now, return a simple text-based icon
  // In a real app, you'd use react-native-vector-icons or similar
  const iconMap: Record<string, string> = {
    home: '🏠',
    people: '👥',
    wifi: '📡',
    settings: '⚙️',
  };
  
  return (
    <Text style={{ fontSize: size, color }}>
      {iconMap[name] || '?'}
    </Text>
  );
};

export const BottomTabNavigator: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={MainScreen}
        options={{
          title: t('navigation.home'),
          tabBarLabel: t('navigation.home'),
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Users" 
        component={UserListScreen}
        options={{
          title: t('navigation.users'),
          tabBarLabel: t('navigation.users'),
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="people" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="WebSocket" 
        component={WebSocketTestScreen}
        options={{
          title: t('navigation.websocket'),
          tabBarLabel: t('navigation.websocket'),
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="wifi" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: t('navigation.settings'),
          tabBarLabel: t('navigation.settings'),
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
