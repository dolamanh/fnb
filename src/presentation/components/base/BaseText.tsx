// Presentation Layer - Base Text Component

import React from 'react';
import {
  Text,
  StyleSheet,
  TextStyle,
  TextProps,
} from 'react-native';

export interface BaseTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline';
  color?: 'primary' | 'secondary' | 'disabled' | 'error' | 'warning' | 'success' | 'info';
  align?: 'left' | 'center' | 'right' | 'justify';
  weight?: 'normal' | 'bold' | 'light' | 'medium' | 'semibold';
  children: React.ReactNode;
  style?: TextStyle;
}

export const BaseText: React.FC<BaseTextProps> = ({
  variant = 'body1',
  color = 'primary',
  align = 'left',
  weight = 'normal',
  children,
  style,
  ...textProps
}) => {
  const getColorStyle = () => {
    switch (color) {
      case 'primary': return styles.colorPrimary;
      case 'secondary': return styles.colorSecondary;
      case 'disabled': return styles.colorDisabled;
      case 'error': return styles.colorError;
      case 'warning': return styles.colorWarning;
      case 'success': return styles.colorSuccess;
      case 'info': return styles.colorInfo;
      default: return styles.colorPrimary;
    }
  };

  const getAlignStyle = () => {
    switch (align) {
      case 'left': return styles.alignLeft;
      case 'center': return styles.alignCenter;
      case 'right': return styles.alignRight;
      case 'justify': return styles.alignJustify;
      default: return styles.alignLeft;
    }
  };

  const getWeightStyle = () => {
    switch (weight) {
      case 'normal': return styles.weightNormal;
      case 'light': return styles.weightLight;
      case 'medium': return styles.weightMedium;
      case 'semibold': return styles.weightSemibold;
      case 'bold': return styles.weightBold;
      default: return styles.weightNormal;
    }
  };

  const textStyle = [
    styles.base,
    styles[variant],
    getColorStyle(),
    getAlignStyle(),
    getWeightStyle(),
    style,
  ];

  return (
    <Text style={textStyle} {...textProps}>
      {children}
    </Text>
  );
};

// Helper function to capitalize first letter
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const styles = StyleSheet.create({
  base: {
    fontFamily: 'System', // Use system font
  },
  
  // Typography variants
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  h5: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  h6: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
  body1: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  body2: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  overline: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '400',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  
  // Colors
  colorPrimary: {
    color: '#1C1C1E',
  },
  colorSecondary: {
    color: '#8E8E93',
  },
  colorDisabled: {
    color: '#C7C7CC',
  },
  colorError: {
    color: '#FF3B30',
  },
  colorWarning: {
    color: '#FF9500',
  },
  colorSuccess: {
    color: '#34C759',
  },
  colorInfo: {
    color: '#007AFF',
  },
  
  // Text alignment
  alignLeft: {
    textAlign: 'left',
  },
  alignCenter: {
    textAlign: 'center',
  },
  alignRight: {
    textAlign: 'right',
  },
  alignJustify: {
    textAlign: 'justify',
  },
  
  // Font weights
  weightNormal: {
    fontWeight: '400',
  },
  weightLight: {
    fontWeight: '300',
  },
  weightMedium: {
    fontWeight: '500',
  },
  weightSemibold: {
    fontWeight: '600',
  },
  weightBold: {
    fontWeight: '700',
  },
});
