import React from 'react';
import { SystemProps, makeStyles, omitStyles } from '../system';
import { Fade } from '../fade';
import { Slide } from '../slide';
import { Portal } from '../portal';
import { styleNames } from '../styles';

import cssStyles from './drawer.module.css';

export type DrawerPlacement = 'start' | 'end' | 'top' | 'bottom';

export interface DrawerProps extends Omit<SystemProps, 'shadow'> {
  placement?: DrawerPlacement;
  backdrop?: boolean;
  shadow?: boolean | string;
  open: boolean;
  onClose: () => void;
}

const mapDrawerPlacement = (placement: DrawerPlacement) => {
  if (placement === 'top') return 'down';
  if (placement === 'bottom') return 'up';
  if (placement === 'start') return 'end';
  return 'start';
};

export const Drawer = ({
  className,
  placement = 'start',
  backdrop = false,
  open,
  onClose,
  children,
  ...props
}: DrawerProps) => {
  const contentRef = React.useRef<HTMLElement | null>(null);
  const classes = makeStyles(props);
  const rest = omitStyles(props);

  return (
    <Portal>
      {backdrop && (
        <Fade in={open}>
          <div onClick={onClose} className={styleNames(cssStyles.backdrop)} />
        </Fade>
      )}
      <Slide in={open} direction={mapDrawerPlacement(placement)} unmountOnExit>
        <div
          className={styleNames(cssStyles.drawer, {
            [cssStyles[placement]]: placement,
          })}
        >
          <div
            ref={contentRef}
            className={styleNames(className, cssStyles.content, classes)}
            {...rest}
          >
            {children}
          </div>
        </div>
      </Slide>
    </Portal>
  );
};
