import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../theme';

interface InputProps extends TextInputProps {
  placeholder: string;
}

const StyledInput = styled(TextInput)`
  background-color: #F5F5F5;
  padding: ${theme.spacing.m}px;
  border-radius: ${theme.radius.s}px;
  font-size: 16px;
  color: ${theme.colors.text};
  border: 1px solid #E0E0E0;
`;

export default function Input({ placeholder, ...props }: InputProps) {
  return (
    <StyledInput
      placeholder={placeholder}
      placeholderTextColor="#999999"
      {...props}
    />
  );
}
