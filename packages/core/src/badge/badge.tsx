import styled from '../styled';

export const Badge = styled.span(
  props => ['badge'],
  props => ({
    bg: props.bg || 'secondary',
  })
);
