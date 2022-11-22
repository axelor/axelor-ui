import styled from '../styled';
import styles from './link.module.scss';

export interface LinkProps {
  underline?: boolean;
}

export const Link = styled.a<LinkProps>(
  ({ color = 'primary' }) => [styles[`link-${color}`]],
  ({ color = 'primary', underline }) => ({
    linkColor: color,
    textDecoration: underline ? 'underline' : 'none',
  })
);
