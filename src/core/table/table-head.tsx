import styled from '../styled';
import { TVariant } from '../system';

export interface TableHeadProps {
  color?: TVariant;
}

export const TableHead = styled.thead<TableHeadProps>(({ color }) => [
  { [`table-${color}`]: color },
]);
