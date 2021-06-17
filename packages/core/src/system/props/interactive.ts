import { ComputeStyles, Config } from '../theme';

export interface InteractiveProps {
  userSelect?: 'all' | 'auto' | 'none';
  pointerEvents?: 'auto' | 'none';
  visible?: boolean;
}

export const InteractiveConfig: Config<InteractiveProps> = {
  userSelect: true,
  pointerEvents: true,
  visible: true,
};

export const interactiveStyles: ComputeStyles<InteractiveProps> = ({
  userSelect,
  pointerEvents,
  visible,
}) => {
  return {
    [`user-select-${userSelect}`]: userSelect,
    [`pe-${pointerEvents}`]: pointerEvents,
    [`visible`]: visible === true,
    [`invisible`]: visible === false,
  };
};
