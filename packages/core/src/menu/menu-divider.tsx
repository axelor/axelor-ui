import React from 'react';

import { Divider, DividerProps } from '../divider/divider';

export interface MenuDividerProps extends DividerProps {}

export const MenuDivider = React.forwardRef<HTMLElement, MenuDividerProps>(
  (props, ref) => {
    return <Divider aria-disabled={true} {...props} ref={ref} />;
  }
);
