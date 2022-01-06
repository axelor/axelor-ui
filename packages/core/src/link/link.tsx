import styled from '../styled';

export interface LinkProps {
  underline?: boolean;
}

export const Link = styled.a<LinkProps>(({ color = 'primary', underline }) => ({
  linkColor: color,
  textDecoration: underline ? 'underline' : 'none',
}));
