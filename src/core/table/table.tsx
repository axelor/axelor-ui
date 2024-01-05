import styled from "../styled";
import { TVariant } from "../system";

export interface TableProps {
  color?: TVariant;
  striped?: boolean;
  bordered?: boolean;
  hover?: boolean;
  size?: "sm" | "md";
  caption?: "top" | "bottom";
}

export const Table = styled.table<TableProps>(
  ({ color, striped, bordered, hover, caption, size = "md" }) => [
    "table",
    {
      [`table-${color}`]: color,
      "table-striped": striped,
      "table-bordered": bordered,
      "table-hover": hover,
      [`table-${size}`]: size !== "md",
      [`caption-${caption}`]: caption,
    },
  ],
);
