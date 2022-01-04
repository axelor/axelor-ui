import styled from '../styled';
import { TVariant } from '../system';

export interface ButtonProps {
  disabled?: boolean;
  outline?: boolean;
  type?: 'button' | 'reset' | 'submit';
  size?: 'sm' | 'lg';
  variant?: TVariant | 'link';
}

export const Button = styled.button<ButtonProps>(
  ({ disabled, variant, outline, size }) => [
    { disabled },
    {
      [`btn`]: true,
      [`btn-outline-${variant}`]: outline,
      [`btn-${variant}`]: !outline,
      [`btn-${size}`]: size,
    },
  ],
  ({ as = 'button', type = 'button', role = 'button', disabled }) =>
    as !== 'button' ? { role } : { disabled, type }
);
