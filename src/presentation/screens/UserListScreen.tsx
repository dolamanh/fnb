import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Modal,
  RefreshControl,
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
import { useTranslation } from 'react-i18next';
import { BaseText } from '../components/base/BaseText';
import { BaseButton } from '../components/base/BaseButton';
import { BaseLoading } from '../components/base/BaseLoading';
import { LanguageButton } from '../components/base/LanguageButton';

export const UserListScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.users);
  const { t } = useTranslation();
  
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

  const handleSaveUser = async (userData: Partial<User>) => {
    try {
      if (editingUser) {
        await dispatch(updateUserAction({ id: editingUser.id, userData })).unwrap();
      } else {
        await dispatch(createUserAction(userData as Omit<User, 'id' | 'createdAt' | 'updatedAt'>)).unwrap();
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
      <BaseText variant="h6" style={styles.emptyStateText}>
        {t('users.noUsers')}
      </BaseText>
      <BaseButton
        title={t('users.createFirstUser')}
        onPress={handleCreateUser}
        variant="primary"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BaseText variant="h1" style={styles.title}>
          {t('users.title')}
        </BaseText>
        <LanguageButton />
        <BaseButton
          title={t('users.addUser')}
          onPress={handleCreateUser}
          variant="primary"
          size="small"
        />
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <BaseText variant="body1" style={styles.errorText}>
            {error}
          </BaseText>
          <View style={styles.errorButtonContainer}>
            <BaseButton
              title={t('common.retry')}
              onPress={handleFetchUsers}
              variant="outline"
              size="small"
            />
            <BaseButton
              title={t('common.clear')}
              onPress={handleClearError}
              variant="outline"
              size="small"
            />
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
          <BaseLoading size="large" />
          <BaseText variant="body1" style={styles.loadingText}>
            {t('common.loading')}
          </BaseText>
        </View>
      )}

      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <UserForm
          user={editingUser}
          onSubmit={handleSaveUser}
          onCancel={handleCancelForm}
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
