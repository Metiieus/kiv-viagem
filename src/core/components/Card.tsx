import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../theme';

interface CardProps {
  children: React.ReactNode;
}

const StyledCard = styled(View)`
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.m}px;
  border-radius: ${theme.radius.m}px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
  margin-bottom: ${theme.spacing.m}px;
`;

export default function Card({ children }: CardProps) {
  return <StyledCard>{children}</StyledCard>;
}
