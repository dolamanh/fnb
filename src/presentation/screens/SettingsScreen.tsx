// Presentation Layer - Settings Screen
import React from 'react';
import { ScrollView } from 'react-native';
import { BaseText } from '../components/base/BaseText';
import { BaseCard } from '../components/base/BaseCard';
import { LanguageButton } from '../components/base/LanguageButton';
import { useTranslation } from '../i18n/hooks';

export const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#f5f5f5' }} 
      contentContainerStyle={{ padding: 16 }}
    >
      <BaseCard style={{ marginBottom: 16 }}>
        <BaseText variant="h3" style={{ marginBottom: 16 }}>
          {t('settings.language')}
        </BaseText>
        <LanguageButton />
      </BaseCard>

      <BaseCard style={{ marginBottom: 16 }}>
        <BaseText variant="h3" style={{ marginBottom: 16 }}>
          {t('settings.about')}
        </BaseText>
        <BaseText variant="body1" style={{ marginBottom: 8 }}>
          FnB App v1.0.0
        </BaseText>
        <BaseText variant="body2" color="secondary">
          {t('settings.description')}
        </BaseText>
      </BaseCard>

      <BaseCard>
        <BaseText variant="h3" style={{ marginBottom: 16 }}>
          {t('settings.architecture')}
        </BaseText>
        <BaseText variant="body2" color="secondary">
          {t('settings.architectureDescription')}
        </BaseText>
      </BaseCard>
    </ScrollView>
  );
};
