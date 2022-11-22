import styled from '../styled';
import { TVariant } from '../system';

export interface TableFootProps {
  color?: TVariant;
}

export const TableFoot = styled.tfoot<TableFootProps>(({ color }) => [
  { [`table-${color}`]: color },
]);
