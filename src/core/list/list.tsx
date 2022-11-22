import styled from '../styled';

export interface ListProps {
  numbered?: boolean;
  flush?: boolean;
}

export interface ListItemProps {
  active?: boolean;
  disabled?: boolean;
}

export const ListItem = styled.li<ListItemProps>(({ active, disabled }) => [
  'list-group-item',
  {
    active,
    disabled,
  },
]);

export const List = styled.ul<ListProps>(
  ({ numbered, flush }) => [
    'list-group',
    {
      'list-group-numbered': numbered,
      'list-group-flush': flush,
    },
  ],
  ({ as, numbered }) => ({
    as: as ?? numbered ? 'ol' : 'ul',
  })
);
