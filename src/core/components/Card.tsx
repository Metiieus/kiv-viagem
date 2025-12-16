import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: any;
}

const StyledCard = styled(View)`
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.l}px; /* Mais respiro interno */
  border-radius: 20px; /* Cantos bem arredondados */
  
  /* Sombra suave e moderna */
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.06;
  shadow-radius: 16px;
  elevation: 2;
  
  margin-bottom: ${theme.spacing.m}px;
  border: 1px solid #F5F5F5;
`;

export default function Card({ children, style }: CardProps) {
  return <StyledCard style={style}>{children}</StyledCard>;
}