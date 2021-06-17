import { TColor, TVariant, Config, ComputeStyles } from '../theme';

export interface BorderProps {
  border?: boolean;
  borderTop?: boolean;
  borderBottom?: boolean;
  borderStart?: boolean;
  borderEnd?: boolean;
  borderWidth?: 0 | 1 | 2 | 3 | 4 | 5;
  borderColor?: TVariant | TColor;
  rounded?: boolean | 0 | 1 | 2 | 3 | 'circle' | 'pill';
  roundedTop?: boolean;
  roundedBottom?: boolean;
  roundedStart?: boolean;
  roundedEnd?: boolean;
}

export const BorderConfig: Config<BorderProps> = {
  border: true,
  borderTop: true,
  borderBottom: true,
  borderStart: true,
  borderEnd: true,
  borderWidth: true,
  borderColor: true,
  rounded: true,
  roundedTop: true,
  roundedBottom: true,
  roundedStart: true,
  roundedEnd: true,
};

export const borderStyles: ComputeStyles<BorderProps> = ({
  border,
  borderTop,
  borderBottom,
  borderStart,
  borderEnd,
  borderWidth,
  borderColor,
  rounded,
  roundedTop,
  roundedBottom,
  roundedStart,
  roundedEnd,
}) => {
  return [
    border && `border`,
    borderTop && `border-top`,
    borderBottom && `border-bottom`,
    borderStart && `border-start`,
    borderEnd && `border-end`,
    border === false && `border-0`,
    borderTop === false && `border-top-0`,
    borderBottom === false && `border-bottom-0`,
    borderStart === false && `border-start-0`,
    borderEnd === false && `border-end-0`,
    borderWidth && `border-${borderWidth}`,
    borderColor && `border-${borderColor}`,
    rounded === true && `rounded`,
    typeof rounded === 'number' && `rounded-${rounded}`,
    typeof rounded === 'string' && `rounded-${rounded}`,
    roundedTop && `rounded-top`,
    roundedBottom && `rounded-bottom`,
    roundedStart && `rounded-start`,
    roundedEnd && `rounded-end`,
  ];
};
