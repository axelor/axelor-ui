import { computeStyle, ComputeStyles, Config } from '../theme';

export type TDisplay =
  | 'none'
  | 'inline'
  | 'inline-block'
  | 'block'
  | 'grid'
  | 'table'
  | 'table-cell'
  | 'table-row'
  | 'flex'
  | 'inline-flex';

export interface DisplayProps {
  d?: TDisplay;
  display?: TDisplay;
}

export interface DisplayPrintProps {
  print?: TDisplay;
}

export const DisplayConfig: Config<DisplayProps & DisplayPrintProps> = {
  d: true,
  display: true,
  print: true,
};

export const displayStyles: ComputeStyles<DisplayProps & DisplayPrintProps> = (
  { d, display, print },
  size
) => {
  return [
    computeStyle('d', d ?? display, size),
    computeStyle('d-print', print),
  ];
};
