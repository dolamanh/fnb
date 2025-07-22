// Presentation Layer - Base Input Component

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';

export interface BaseInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  required?: boolean;
  variant?: 'outlined' | 'filled';
}

export const BaseInput: React.FC<BaseInputProps> = ({
  label,
  error,
  helperText,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  required = false,
  variant = 'outlined',
  onFocus,
  onBlur,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const inputContainerStyle = [
    styles.inputContainer,
    styles[variant],
    isFocused && styles.focused,
    error && styles.error,
  ];

  const textInputStyle = [
    styles.input,
    inputStyle,
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <View style={inputContainerStyle}>
        <TextInput
          style={textInputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor="#8E8E93"
          {...textInputProps}
        />
      </View>
      
      {error ? (
        <Text style={[styles.errorText, errorStyle]}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  
  required: {
    color: '#FF3B30',
  },
  
  inputContainer: {
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  
  // Variants
  outlined: {
    borderWidth: 1,
    borderColor: '#D1D1D6',
  },
  
  filled: {
    backgroundColor: '#F2F2F7',
    borderWidth: 0,
  },
  
  // States
  focused: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  
  error: {
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1C1E',
    minHeight: 44,
  },
  
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 4,
  },
  
  helperText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
});
