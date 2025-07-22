// Presentation Layer - Language Selector Component

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { BaseText } from './BaseText';
import { BaseCard } from './BaseCard';
import { useTranslation } from '../../i18n/hooks';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  visible,
  onClose,
}) => {
  const { changeLanguage, getCurrentLanguage } = useTranslation();
  const currentLanguage = getCurrentLanguage();

  const handleLanguageSelect = (languageCode: string) => {
    changeLanguage(languageCode);
    onClose();
  };

  const renderLanguageItem = ({ item }: { item: Language }) => {
    const isSelected = item.code === currentLanguage;
    
    return (
      <TouchableOpacity
        style={[styles.languageItem, isSelected && styles.selectedItem]}
        onPress={() => handleLanguageSelect(item.code)}
      >
        <BaseText variant="body1" style={styles.flag}>
          {item.flag}
        </BaseText>
        <BaseText 
          variant="body1" 
          color={isSelected ? 'info' : 'primary'}
          weight={isSelected ? 'semibold' : 'normal'}
          style={styles.languageName}
        >
          {item.name}
        </BaseText>
        {isSelected && (
          <BaseText variant="body1" color="info">
            ✓
          </BaseText>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1}
          onPress={onClose}
        />
        
        <View style={styles.container}>
          <BaseCard variant="elevated" padding="medium">
            <BaseText variant="h6" align="center" style={styles.title}>
              Select Language / Chọn ngôn ngữ
            </BaseText>
            
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.code}
              renderItem={renderLanguageItem}
              showsVerticalScrollIndicator={false}
            />
          </BaseCard>
        </View>
      </View>
    </Modal>
  );
};

export const LanguageSelectorButton: React.FC<{
  onPress: () => void;
}> = ({ onPress }) => {
  const { getCurrentLanguage } = useTranslation();
  const currentLanguage = getCurrentLanguage();
  const currentLang = LANGUAGES.find(lang => lang.code === currentLanguage);

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <BaseText variant="body2">
        {currentLang?.flag} {currentLang?.name}
      </BaseText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  container: {
    width: '80%',
    maxWidth: 300,
  },
  
  title: {
    marginBottom: 16,
  },
  
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  
  selectedItem: {
    backgroundColor: '#F0F8FF',
  },
  
  flag: {
    fontSize: 20,
    marginRight: 12,
  },
  
  languageName: {
    flex: 1,
  },
  
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F2F2F7',
  },
});
