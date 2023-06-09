import styled from "../styled";

export interface TableCaptionProps {
  placement?: "start" | "center" | "end";
}

export const TableCaption = styled.caption<TableCaptionProps>(
  ({ placement = "start" }) => [{ [`text-${placement}`]: placement }]
);
