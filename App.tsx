/**
 * FnB App with Clean Architecture + WatermelonDB + DI + Redux + Navigation
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme, Alert, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/presentation/store';
import { container } from './src/di/container';
import { TYPES } from './src/di/types';
import { IDatabaseService } from './src/core/ports/services/IDatabaseService';
import { RootStackNavigator } from './src/presentation/navigation/RootStackNavigator';
import './src/presentation/i18n'; // Initialize i18n

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const databaseService = container.get<IDatabaseService>(TYPES.DatabaseService);
        await databaseService.initializeDatabase();
        console.log('App initialized successfully');
      } catch (error) {
        console.error('Failed to initialize app:', error);
        Alert.alert('Error', 'Failed to initialize the application');
      }
    };

    initializeApp();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <RootStackNavigator />
        </SafeAreaView>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
