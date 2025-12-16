import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
}

const StyledButton = styled(TouchableOpacity)<{ variant: string; disabled: boolean }>`
  background-color: ${({ variant, disabled }) =>
    disabled ? '#CCCCCC' : variant === 'primary' ? theme.colors.primary : theme.colors.success};
  padding: ${theme.spacing.m}px;
  border-radius: ${theme.radius.m}px;
  align-items: center;
  justify-content: center;
  min-height: 50px;
`;

const ButtonText = styled(Text)`
  color: ${theme.colors.background};
  font-size: 16px;
  font-weight: bold;
`;

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  loading = false,
  disabled = false 
}: ButtonProps) {
  return (
    <StyledButton 
      variant={variant} 
      onPress={onPress} 
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.background} />
      ) : (
        <ButtonText>{title}</ButtonText>
      )}
    </StyledButton>
  );
}
