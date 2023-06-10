import styled from "../styled";
import { StyleProps } from "../system";

import styles from "./link.module.scss";

export interface LinkProps {
  color?: StyleProps["linkColor"];
  underline?: boolean | StyleProps["linkUnderline"];
  offset?: StyleProps["linkOffset"];
}

export const Link = styled.a<LinkProps>(
  ({ color = "primary" }) => [styles[`link-${color}`]],
  ({ color = "primary", underline, offset }) => ({
    linkColor: color,
    linkOffset: offset,
    linkUnderline: underline
      ? underline === true
        ? color
        : underline
      : undefined,
    textDecoration: underline === false ? "none" : undefined,
  })
);
