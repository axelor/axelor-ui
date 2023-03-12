import styled from "../styled";
import styles from "./divider.module.css";

export interface DividerProps {
  vertical?: boolean;
}

export const Divider = styled.hr<DividerProps>(({ vertical }) => [
  styles.divider,
  {
    [styles.vertical]: vertical,
  },
]);
