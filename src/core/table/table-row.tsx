import styled from "../styled";
import { TVariant } from "../system";

export interface TableRowProps {
  color?: TVariant;
  selected?: boolean;
}

export const TableRow = styled.tr<TableRowProps>(({ color, selected }) => [
  {
    [`table-${color}`]: color,
    "table-active": selected,
  },
]);
