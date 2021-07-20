import { createPopper, Instance, Placement } from '@popperjs/core';
import React, { useEffect, useRef, useState } from 'react';

import { Fade } from '../fade';
import { Portal } from '../portal';

export type PopperPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'start'
  | 'start-top'
  | 'start-bottom'
  | 'end'
  | 'end-top'
  | 'end-bottom';

export interface PopperProps {
  open?: boolean;
  target: HTMLElement | null;
  container?: Element | null | (() => Element | null);
  children?: React.ReactNode;
  placement?: PopperPlacement;
  strategy?: 'absolute' | 'fixed';
  offset?: [number, number];
  transition?: null | React.FunctionComponent<{
    in: boolean | undefined;
    appear: boolean;
    onEnter: () => void;
    onExited: () => void;
  }>;
}

const PlacementMapping: Record<PopperPlacement, Placement> = {
  'start': 'left',
  'start-top': 'left-start',
  'start-bottom': 'left-end',
  'end': 'right',
  'end-top': 'right-start',
  'end-bottom': 'right-end',
  'top': 'top',
  'top-start': 'top-start',
  'top-end': 'top-end',
  'bottom': 'bottom',
  'bottom-start': 'bottom-start',
  'bottom-end': 'bottom-end',
};

const PopperWrapper = ({
  open,
  target,
  placement: popperPlacement = 'bottom',
  strategy = 'absolute',
  offset,
  children,
  ...props
}: PopperProps) => {
  const instance = useRef<Instance | null>(null);
  const [wrapperEl, setWrapperEl] = useState<HTMLDivElement | null>(null);
  const placement = PlacementMapping[popperPlacement];

  useEffect(() => {
    instance.current?.forceUpdate();
  });

  useEffect(() => {
    if (!open || target === null || wrapperEl === null) {
      return undefined;
    }

    const modifiers: any[] = [];
    const options = { placement, strategy, modifiers };

    if (offset) {
      modifiers.push({
        name: 'offset',
        options: {
          offset,
        },
      });
    }

    instance.current = createPopper(target, wrapperEl, options);

    return () => {
      instance.current?.destroy();
      instance.current = null;
    };
  }, [target, wrapperEl, open]);

  return (
    <div ref={setWrapperEl} {...props}>
      {children}
    </div>
  );
};

export const Popper = ({
  open,
  placement = 'bottom',
  container,
  transition = Fade,
  children,
  ...props
}: PopperProps) => {
  const [exited, setExited] = React.useState(true);

  const handleEnter = () => {
    setExited(false);
  };

  const handleExited = () => {
    setExited(true);
  };

  if (exited && !open) {
    return null;
  }

  return (
    <Portal container={container}>
      <PopperWrapper placement={placement} open={open || !exited} {...props}>
        {transition
          ? transition({
              in: open,
              appear: true,
              onEnter: handleEnter,
              onExited: handleExited,
              children,
            })
          : children}
      </PopperWrapper>
    </Portal>
  );
};
