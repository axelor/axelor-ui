import * as React from 'react';
import BsIcons from 'bootstrap-icons/bootstrap-icons.svg';

import { styleNames } from '../styles';
import { makeStyles, omitStyles } from '../system';

type SvgIcon = React.FunctionComponent<React.SVGProps<SVGSVGElement>> & {
  title?: string;
};

const IconSize = {
  sm: '.875em',
  lg: '1.33em',
  1: '1em',
  2: '2em',
  3: '3em',
  4: '4em',
  5: '5em',
  6: '6em',
  7: '7em',
  8: '8em',
  9: '9em',
  10: '10em',
} as const;

export interface IconProps extends React.HTMLAttributes<HTMLElement> {
  use: string | SvgIcon;
  size?: keyof typeof IconSize;
  title?: string;
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, use, size = 1, title, ...props }, ref) => {
    const classes = makeStyles(props);
    const rest = omitStyles(props);

    const attrs = {
      ...rest,
      strokeWidth: 0,
      stroke: 'currentColor',
      fill: 'currentColor',
      width: IconSize[size],
      height: IconSize[size],
      className: styleNames(className, classes),
      ref,
    };

    if (typeof use === 'string') {
      const href = `${BsIcons}#${use}`;
      return (
        <svg {...attrs}>
          <use href={href} />
        </svg>
      );
    }

    const Component = use;
    return <Component {...attrs} />;
  }
);
