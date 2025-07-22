// Presentation Layer - Base Loading Component

import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { BaseText } from './BaseText';

export interface BaseLoadingProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  overlay?: boolean;
  style?: ViewStyle;
}

export const BaseLoading: React.FC<BaseLoadingProps> = ({
  size = 'large',
  color = '#007AFF',
  text,
  overlay = false,
  style,
}) => {
  const containerStyle = [
    styles.container,
    overlay && styles.overlay,
    style,
  ];

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <BaseText 
          variant="body2" 
          color="secondary" 
          align="center"
          style={styles.text}
        >
          {text}
        </BaseText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1000,
  },
  
  text: {
    marginTop: 12,
  },
});
