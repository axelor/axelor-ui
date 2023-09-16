import styled from "../styled";
import { TVariant } from "../system";

import styles from "./badge.module.scss";

export interface BadgeProps {
  variant?: TVariant;
}

export const Badge = styled.span<BadgeProps>(
  () => [styles.badge],
  ({ variant }) => [
    {
      [`badge`]: true,
      [`text-bg-${variant}`]: variant,
    },
  ],
);
