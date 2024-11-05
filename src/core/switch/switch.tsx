import { Input } from "../input";
import styled, { withStyled } from "../styled";
import { useClassNames } from "../styles";
import styles from "./switch.module.css";

export interface SwitchProps {
  size?: "sm" | "lg";
  type?: "checkbox";
}

const SwitchInput = styled(Input)<SwitchProps>(
  ({ size }) => [size && styles[`size-${size}`]],
  ({ readOnly, pointerEvents, role = "switch" }) => ({
    role,
    type: "checkbox",
    pointerEvents: (pointerEvents ?? readOnly) ? "none" : undefined,
  }),
);

export const Switch = withStyled(SwitchInput)((props, ref) => {
  const classNames = useClassNames();
  return (
    <div className={classNames(["form-check", "form-switch"])}>
      <SwitchInput {...props} ref={ref} />
    </div>
  );
});
