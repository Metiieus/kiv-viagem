import React, { useState } from 'react';
import { TextInput, TextInputProps, View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme';

interface InputProps extends TextInputProps {
  placeholder?: string;
  label?: string;
  error?: string;
  onClear?: () => void;
}

const Container = styled(View)`
  margin-bottom: ${theme.spacing.m}px;
  width: 100%;
`;

const Label = styled(Text)`
  font-size: ${theme.typography.sizes.s}px;
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.xs}px;
  margin-left: ${theme.spacing.xs}px;
`;

const InputWrapper = styled(View) <{ isFocused: boolean; hasError: boolean }>`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.surface};
  border-radius: ${theme.radius.m}px;
  border-width: 1px;
  border-color: ${({ isFocused, hasError }) =>
    hasError ? theme.colors.error :
      isFocused ? theme.colors.primary : theme.colors.border};
  padding-horizontal: ${theme.spacing.m}px;
`;

const StyledInput = styled(TextInput)`
  flex: 1;
  padding-vertical: ${theme.spacing.m}px;
  font-size: ${theme.typography.sizes.m}px;
  color: ${theme.colors.text};
`;

const ErrorText = styled(Text)`
  font-size: ${theme.typography.sizes.xs}px;
  color: ${theme.colors.error};
  margin-top: ${theme.spacing.xs}px;
  margin-left: ${theme.spacing.xs}px;
`;

export default function Input({ placeholder, label, error, onClear, value, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Container>
      {label && <Label>{label}</Label>}
      <InputWrapper isFocused={isFocused} hasError={!!error}>
        <StyledInput
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textLight}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus && props.onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur && props.onBlur(e);
          }}
          value={value}
          {...props}
        />
        {onClear && value && value.length > 0 && (
          <TouchableOpacity onPress={onClear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialIcons name="close" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </InputWrapper>
      {error && <ErrorText>{error}</ErrorText>}
    </Container>
  );
}