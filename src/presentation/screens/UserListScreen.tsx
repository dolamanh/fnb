import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Platform,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchUsers, 
  createUser as createUserAction, 
  updateUser as updateUserAction, 
  deleteUser as deleteUserAction,
  clearError 
} from '../store/slices/usersSlice';
import { UserItem } from '../components/UserItem';
import { UserForm } from '../components/UserForm';
import { User } from '../../core/entities/user/User';
import { testDI } from '../../debug/TestDI';

export const UserListScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.users);
  
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();

  // Debug DI on component mount
  useEffect(() => {
    console.log('UserListScreen mounted, testing DI...');
    testDI();
    // Fetch users on mount
    dispatch(fetchUsers());
  }, [dispatch]);

  // Action handlers
  const handleFetchUsers = () => {
    dispatch(fetchUsers());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const handleDeleteUser = (id: string) => {
    dispatch(deleteUserAction(id));
  };

  const handleCreateUser = () => {
    setEditingUser(undefined);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleSaveUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingUser) {
        await dispatch(updateUserAction({ id: editingUser.id, userData })).unwrap();
      } else {
        await dispatch(createUserAction(userData)).unwrap();
      }
      setShowForm(false);
      setEditingUser(undefined);
    } catch (error) {
      // Error is handled in Redux slice
      console.error('Save user error:', error);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingUser(undefined);
  };

  const renderUser = ({ item }: { item: User }) => (
    <UserItem
      user={item}
      onEdit={handleEditUser}
      onDelete={handleDeleteUser}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No users found</Text>
      <TouchableOpacity style={styles.createButton} onPress={handleCreateUser}>
        <Text style={styles.createButtonText}>Create First User</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Users</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateUser}>
          <Text style={styles.addButtonText}>+ Add User</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <View style={styles.errorButtonContainer}>
            <TouchableOpacity style={styles.retryButton} onPress={handleFetchUsers}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearButton} onPress={handleClearError}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        contentContainerStyle={users.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={handleFetchUsers}
          />
        }
      />

      {loading && users.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      )}

      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <UserForm
          user={editingUser}
          onSave={handleSaveUser}
          onCancel={handleCancelForm}
          loading={loading}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    marginBottom: 8,
  },
  errorButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  retryButton: {
    backgroundColor: '#c62828',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  clearButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
