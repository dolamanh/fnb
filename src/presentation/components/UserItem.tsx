import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { User } from '../../core/entities/user/User';
import { useTranslation } from 'react-i18next';
import { BaseText } from './base/BaseText';
import { BaseButton } from './base/BaseButton';
import { BaseCard } from './base/BaseCard';

interface UserItemProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export const UserItem: React.FC<UserItemProps> = ({ user, onEdit, onDelete }) => {
  const { t } = useTranslation();

  const handleDelete = () => {
    Alert.alert(
      t('users.deleteUser'),
      t('users.confirmDelete'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.delete'), style: 'destructive', onPress: () => onDelete(user.id) },
      ]
    );
  };

  return (
    <BaseCard style={styles.container}>
      <View style={styles.userInfo}>
        <BaseText variant="h6" style={styles.name}>
          {user.name}
        </BaseText>
        <BaseText variant="body2" style={styles.email}>
          {user.email}
        </BaseText>
        {user.phone && (
          <BaseText variant="caption" style={styles.phone}>
            {user.phone}
          </BaseText>
        )}
        <BaseText variant="caption" style={{...styles.status, color: user.isActive ? '#4CAF50' : '#F44336'}}>
          {user.isActive ? 'Active' : 'Inactive'}
        </BaseText>
      </View>

      <View style={styles.actions}>
        <BaseButton
          title={t('common.edit')}
          onPress={() => onEdit(user)}
          variant="outline"
          size="small"
          style={styles.editButton}
        />
        <BaseButton
          title={t('common.delete')}
          onPress={handleDelete}
          variant="danger"
          size="small"
          style={styles.deleteButton}
        />
      </View>
    </BaseCard>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfo: {
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  phone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  status: {
    fontSize: 12,
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
