// Presentation Layer - Base Card Component

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

export interface BaseCardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
  pressable?: boolean;
  style?: ViewStyle;
}

export const BaseCard: React.FC<BaseCardProps> = ({
  children,
  variant = 'elevated',
  padding = 'medium',
  margin = 'none',
  borderRadius = 'medium',
  pressable = false,
  style,
  ...touchableProps
}) => {
  const getPaddingStyle = () => {
    switch (padding) {
      case 'none': return styles.paddingNone;
      case 'small': return styles.paddingSmall;
      case 'medium': return styles.paddingMedium;
      case 'large': return styles.paddingLarge;
      default: return styles.paddingMedium;
    }
  };

  const getMarginStyle = () => {
    switch (margin) {
      case 'none': return styles.marginNone;
      case 'small': return styles.marginSmall;
      case 'medium': return styles.marginMedium;
      case 'large': return styles.marginLarge;
      default: return styles.marginNone;
    }
  };

  const getRadiusStyle = () => {
    switch (borderRadius) {
      case 'none': return styles.radiusNone;
      case 'small': return styles.radiusSmall;
      case 'medium': return styles.radiusMedium;
      case 'large': return styles.radiusLarge;
      default: return styles.radiusMedium;
    }
  };

  const cardStyle = [
    styles.base,
    styles[variant],
    getPaddingStyle(),
    getMarginStyle(),
    getRadiusStyle(),
    style,
  ];

  if (pressable) {
    return (
      <TouchableOpacity
        style={cardStyle}
        activeOpacity={0.8}
        {...touchableProps}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

// Helper function to capitalize first letter
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#FFFFFF',
  },
  
  // Variants
  elevated: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android
  },
  
  outlined: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  
  filled: {
    backgroundColor: '#F2F2F7',
  },
  
  // Padding
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: 8,
  },
  paddingMedium: {
    padding: 16,
  },
  paddingLarge: {
    padding: 24,
  },
  
  // Margin
  marginNone: {
    margin: 0,
  },
  marginSmall: {
    margin: 8,
  },
  marginMedium: {
    margin: 16,
  },
  marginLarge: {
    margin: 24,
  },
  
  // Border Radius
  radiusNone: {
    borderRadius: 0,
  },
  radiusSmall: {
    borderRadius: 4,
  },
  radiusMedium: {
    borderRadius: 8,
  },
  radiusLarge: {
    borderRadius: 16,
  },
});
