import React from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../theme';

interface InputProps extends TextInputProps {
  placeholder: string;
  label?: string; // Adicionei suporte opcional para Label
}

const Container = styled(View)`
  margin-bottom: 8px;
`;

const StyledInput = styled(TextInput)`
  background-color: #F8F9FA; /* Fundo cinza super claro */
  padding: 16px;
  border-radius: 16px; /* Borda bem arredondada (estilo iOS/Modern) */
  font-size: 16px;
  color: ${theme.colors.text};
  border: 1px solid transparent; /* Sem borda visível inicialmente */
  
  /* Se quiser adicionar foco depois, pode manipular aqui */
`;

export default function Input({ placeholder, ...props }: InputProps) {
  return (
    <Container>
      <StyledInput
        placeholder={placeholder}
        placeholderTextColor="#A0A0A0"
        {...props}
      />
    </Container>
  );
}