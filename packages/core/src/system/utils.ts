import { Breakpoints } from './types';

export const isNumber = (value: any) => typeof value === 'number';

export const isString = (value: any) => typeof value === 'string';

export const isNumeric = (value: any) =>
  isString(value) && value - parseFloat(value) + 1 >= 0;

export const isUnitSize = (value: any) =>
  isString(value) && parseFloat(value).toString() != value;

export const isReponsive = (value: any) =>
  typeof value === 'object' && Breakpoints.some(bp => bp in value);

export const toPixel = (value: any): any => {
  if (isUnitSize(value)) return value;
  if (isNumeric(value)) return `${value}px`;
  if (isNumber(value)) return `${value}px`;
  return value;
};
