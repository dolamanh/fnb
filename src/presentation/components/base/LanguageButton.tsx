import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseButton } from './BaseButton';
import { useTranslation } from 'react-i18next';

export interface LanguageButtonProps {
  style?: any;
}

export const LanguageButton: React.FC<LanguageButtonProps> = ({ style }) => {
  const { i18n } = useTranslation();
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <View style={[styles.container, style]}>
      <BaseButton
        title={i18n.language === 'en' ? 'VI' : 'EN'}
        onPress={toggleLanguage}
        variant="outline"
        size="small"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
