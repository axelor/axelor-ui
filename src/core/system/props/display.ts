import { Config, Responsive } from '../types';

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
  d?: Responsive<TDisplay>;
  display?: Responsive<TDisplay>;
}

export interface DisplayPrintProps {
  print?: TDisplay;
}

const display = (name: string) => (value: any, breakpoint?: string) => {
  return breakpoint ? `${name}-${breakpoint}-${value}` : `${name}-${value}`;
};

export const DisplayConfig: Config<DisplayProps & DisplayPrintProps> = {
  d: display('d'),
  display: display('d'),
  print: display('d-print'),
};
