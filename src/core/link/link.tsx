import styled from "../styled";
import { StyleProps } from "../system";
import styles from "./link.module.scss";

export interface LinkProps {
  color?: StyleProps["linkColor"];
  underline?: boolean | StyleProps["linkUnderline"];
}

export const Link = styled.a<LinkProps>(
  ({ color = "primary" }) => [styles[`link-${color}`]],
  ({ color = "primary", underline }) => ({
    linkColor: color,
    linkUnderline: underline
      ? underline === true
        ? color
        : underline
      : undefined,
  })
);
