import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { User } from '../../core/entities/user/User';
import { useTranslation } from 'react-i18next';
import { BaseText } from './base/BaseText';
import { BaseInput } from './base/BaseInput';
import { BaseButton } from './base/BaseButton';

interface UserFormProps {
  user?: User;
  onSubmit: (userData: Partial<User>) => void;
  onCancel: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isActive, setIsActive] = useState(user?.isActive ?? true);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = t('users.form.nameRequired');
    }

    if (!email.trim()) {
      newErrors.email = t('users.form.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('users.form.emailInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const userData: Partial<User> = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        isActive,
      };
      onSubmit(userData);
    } else {
      Alert.alert(t('common.error'), t('validation.required'));
    }
  };

  return (
    <View style={styles.container}>
      <BaseText variant="h2" style={styles.title}>
        {user ? t('users.editUser') : t('users.addUser')}
      </BaseText>

      <View style={styles.form}>
        <View style={styles.field}>
          <BaseText variant="body1" style={styles.label}>
            {t('users.form.name')} *
          </BaseText>
          <BaseInput
            placeholder={t('users.form.namePlaceholder')}
            value={name}
            onChangeText={setName}
            error={errors.name}
          />
        </View>

        <View style={styles.field}>
          <BaseText variant="body1" style={styles.label}>
            {t('users.form.email')} *
          </BaseText>
          <BaseInput
            placeholder={t('users.form.emailPlaceholder')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
        </View>

        <View style={styles.field}>
          <BaseText variant="body1" style={styles.label}>
            {t('users.form.phone')}
          </BaseText>
          <BaseInput
            placeholder={t('users.form.phonePlaceholder')}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            error={errors.phone}
          />
        </View>

        <View style={styles.switchField}>
          <BaseText variant="body1" style={styles.label}>
            Active
          </BaseText>
          <Switch
            value={isActive}
            onValueChange={setIsActive}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isActive ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.buttons}>
        <BaseButton
          title={t('common.cancel')}
          onPress={onCancel}
          variant="outline"
          style={styles.cancelButton}
        />
        <BaseButton
          title={t('common.save')}
          onPress={handleSubmit}
          variant="primary"
          style={styles.saveButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
    color: '#333',
  },
  switchField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    flex: 1,
    marginLeft: 10,
  },
});

export default UserForm;
