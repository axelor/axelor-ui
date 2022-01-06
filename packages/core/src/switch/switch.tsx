import { Input } from '../input';
import styled, { withStyled } from '../styled';
import { useStyleNames } from '../system';
import styles from './switch.module.css';

export interface SwitchProps {
  size?: 'sm' | 'lg';
  type?: 'checkbox';
}

const SwitchInput = styled(Input)<SwitchProps>(
  ({ size }) => [size && styles[`size-${size}`]],
  ({ readOnly, pointerEvents, role = 'switch' }) => ({
    role,
    type: 'checkbox',
    pointerEvents: pointerEvents ?? readOnly ? 'none' : undefined,
  })
);

export const Switch = withStyled(SwitchInput)((props, ref) => {
  const className = useStyleNames(() => ['form-check', 'form-switch'], []);
  return (
    <div className={className}>
      <SwitchInput {...props} ref={ref} />
    </div>
  );
});
