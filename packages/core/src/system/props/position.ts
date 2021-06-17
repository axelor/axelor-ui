import { computeStyle, ComputeStyles, Config } from '../theme';

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
  pos: true,
  position: true,
  edge: true,
};

export const positionStyles: ComputeStyles<PositionProps> = ({
  pos,
  position,
  edge: { t, b, s, e, middle } = {},
}) => {
  return [
    computeStyle('position', pos ?? position),
    computeStyle('top', t),
    computeStyle('bottom', b),
    computeStyle('start', s),
    computeStyle('end', e),
    middle === true && `translate-middle`,
    middle === 'x' && `translate-middle-x`,
    middle === 'y' && `translate-middle-y`,
  ];
};
