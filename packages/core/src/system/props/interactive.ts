import { Config } from '../types';

export interface InteractiveProps {
  userSelect?: 'all' | 'auto' | 'none';
  pointerEvents?: 'auto' | 'none';
  visible?: boolean;
}

export const InteractiveConfig: Config<InteractiveProps> = {
  userSelect: value => `user-select-${value}`,
  pointerEvents: value => `pe-${value}`,
  visible: value => ({
    classes: {
      [`visible`]: value == true,
      [`invisible`]: value === false,
    },
  }),
};
