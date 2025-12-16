import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: any;
  variant?: 'default' | 'flat' | 'outlined';
}

const StyledCard = styled(View) <{ variant: string }>`
  background-color: ${theme.colors.surface};
  padding: ${theme.spacing.l}px;
  border-radius: 16px; /* Professional curve, not too round */
  
  /* Conditional Styles */
  ${({ variant }) => variant === 'flat' && `
    border-width: 0;
    background-color: #F8FAFC; /* Slight grey background for flat cards */
  `}

  ${({ variant }) => variant === 'outlined' && `
    border-width: 1px;
    border-color: ${theme.colors.border};
    background-color: ${theme.colors.surface};
  `}
  
  margin-bottom: ${theme.spacing.m}px;

  /* Elevation for default cards */
  ${({ variant }) => variant === 'default' && `
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.08;
    shadow-radius: 8px;
    elevation: 3;
    border-width: 1px;
    border-color: rgba(0,0,0,0.03);
  `}
`;

export default function Card({ children, style, variant = 'default' }: CardProps) {
  return (
    <StyledCard style={style} variant={variant}>
      {children}
    </StyledCard>
  );
}