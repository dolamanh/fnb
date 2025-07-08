/**
 * FnB App with Clean Architecture + WatermelonDB + DI + Redux
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Alert, SafeAreaView, Platform } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { container } from './src/di/container';
import { TYPES } from './src/di/types';
import { IDatabaseService } from './src/data/datasources/IDatabaseService';
import { UserListScreen } from './src/presentation/screens/UserListScreen';

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
      <SafeAreaView style={styles.container}>
        <UserListScreen />
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default App;
