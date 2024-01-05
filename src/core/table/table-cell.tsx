import styled from "../styled";
import { TVariant } from "../system";

export interface TableCellProps {
  as?: "td" | "th";
  color?: TVariant;
  selected?: boolean;
}

export const TableCell = styled.td<TableCellProps>(
  ({ color, selected }) => [
    {
      [`table-${color}`]: color,
      "table-active": selected,
    },
  ],
  ({ as = "td" }) => ({ as }),
);
