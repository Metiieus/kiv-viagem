import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
}

const getBackgroundColor = (variant: string, disabled: boolean) => {
  if (disabled) return theme.colors.textLight;
  switch (variant) {
    case 'primary': return theme.colors.primary;
    case 'secondary': return theme.colors.secondary;
    case 'danger': return theme.colors.error;
    case 'outline': return 'transparent';
    default: return theme.colors.primary;
  }
};

const getTextColor = (variant: string, disabled: boolean) => {
  if (variant === 'outline') return disabled ? theme.colors.textLight : theme.colors.primary;
  return '#FFFFFF';
};

const StyledButton = styled(TouchableOpacity) <{ variant: string; disabled: boolean }>`
  background-color: ${({ variant, disabled }) => getBackgroundColor(variant, disabled)};
  padding: ${theme.spacing.m}px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  width: 100%;
  flex-direction: row;
  
  ${({ variant, disabled }) => variant === 'outline' && `
    border-width: 1.5px;
    border-color: ${disabled ? theme.colors.textLight : theme.colors.primary};
  `}

  ${({ variant, disabled }) => !disabled && (variant === 'primary' || variant === 'secondary') && `
    shadow-color: ${theme.colors.primaryDark};
    shadow-offset: 0px 4px;
    shadow-opacity: 0.2;
    shadow-radius: 4px;
    elevation: 3;
  `}
`;

const ButtonText = styled(Text) <{ variant: string; disabled: boolean }>`
  color: ${({ variant, disabled }) => getTextColor(variant, disabled)};
  font-size: ${theme.typography.sizes.m}px;
  font-weight: 600;
  letter-spacing: 0.2px;
  text-align: center;
`;

const IconContainer = styled(View)`
  margin-right: 12px;
`;

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  leftIcon
}: ButtonProps) {
  return (
    <StyledButton
      variant={variant}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? theme.colors.primary : '#FFF'} />
      ) : (
        <>
          {leftIcon && <IconContainer>{leftIcon}</IconContainer>}
          <ButtonText variant={variant} disabled={disabled}>{title}</ButtonText>
        </>
      )}
    </StyledButton>
  );
}
