import styled from '../styled';

export const MenuDivider = styled.hr(
  () => ['dropdown-divider'],
  () => ({ 'aria-disabled': true })
);
