// Presentation Layer - Stack Navigator
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { BottomTabNavigator } from './BottomTabNavigator';
import { WebSocketTestScreen } from '../screens/WebSocketTestScreen';
import { UserListScreen } from '../screens/UserListScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const RootStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Main" 
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="WebSocketTest" 
        component={WebSocketTestScreen}
        options={{
          title: 'WebSocket Test',
        }}
      />
      <Stack.Screen 
        name="UserList" 
        component={UserListScreen}
        options={{
          title: 'User Management',
        }}
      />
    </Stack.Navigator>
  );
};
