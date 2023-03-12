import styled from "../styled";

export interface ButtonGroupProps {
  size?: "sm" | "lg";
  vertical?: boolean;
}

export const ButtonGroup = styled.div<ButtonGroupProps>(
  ({ size, vertical }) => [
    {
      [`btn-group`]: !vertical,
      [`btn-group-vertical`]: vertical,
      [`btn-group-${size}`]: size,
    },
  ],
  ({ role = "group" }) => ({ role })
);
