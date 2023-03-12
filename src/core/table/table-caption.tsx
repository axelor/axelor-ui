import styled from "../styled";

export interface TableCaptionProps {
  placement?: "top" | "bottom";
}

export const TableCaption = styled.caption<TableCaptionProps>(
  ({ placement }) => [{ "caption-top": placement === "top" }]
);
