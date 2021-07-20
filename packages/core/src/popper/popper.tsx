import { createPopper, Instance, Placement } from '@popperjs/core';
import React, { useEffect, useRef, useState } from 'react';

import { TransitionProps } from '../transitions/types';

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
  transition?: React.ComponentType<TransitionProps>;
  transitionProps?: Omit<TransitionProps, 'in' | 'appear' | 'children'>;
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

    instance.current = createPopper(target, wrapperEl, {
      placement,
    });

    return () => {
      instance.current?.destroy();
      instance.current = null;
    };
  }, [target, wrapperEl, open]);

  return <div ref={setWrapperEl} {...props}>{children}</div>;
};

export const Popper = ({
  open,
  placement = 'bottom',
  container,
  transition: Transition = Fade,
  transitionProps: { onEnter, onExited, ...transitionProps } = {},
  children,
  ...props
}: PopperProps) => {
  const [exited, setExited] = React.useState(true);

  const handleEnter = (node: HTMLElement, isAppearing: boolean) => {
    setExited(false);
    if (onEnter) {
      onEnter(node, isAppearing);
    }
  };

  const handleExited = (node: HTMLElement) => {
    setExited(true);
    if (onExited) {
      onExited(node);
    }
  };

  const show = open || !exited;
  if (!show) {
    return null;
  }

  return (
    <Portal container={container}>
      <PopperWrapper placement={placement} open={show} {...props}>
        <Transition
          in={open}
          appear={true}
          onEnter={handleEnter}
          onExited={handleExited}
          {...transitionProps}
        >
          {children}
        </Transition>
      </PopperWrapper>
    </Portal>
  );
};
