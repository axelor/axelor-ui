import { Config } from '../types';

export type TPosition = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';

export type TPositionValue = 0 | 50 | 100;

export type TPositionEdge = {
  t?: TPositionValue;
  b?: TPositionValue;
  s?: TPositionValue;
  e?: TPositionValue;
  middle?: boolean | 'x' | 'y';
};

export interface PositionProps {
  pos?: TPosition;
  position?: TPosition;
  edge?: TPositionEdge;
}

export const PositionConfig: Config<PositionProps> = {
  pos: value => `position-${value}`,
  position: value => `position-${value}`,
  edge: ({ t, b, s, e, middle }) => {
    return {
      classes: {
        [`top-${t}`]: t,
        [`bottom-${b}`]: b,
        [`start-${s}`]: s,
        [`end-${e}`]: e,
        [`translate-middle`]: middle === true,
        [`translate-x`]: middle === 'x',
        [`translate-y`]: middle === 'y',
      },
    };
  },
};
