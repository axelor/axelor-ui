import React from 'react';
import { Transition } from 'react-transition-group';
import { TransitionProps } from '../transitions/types';
import {
  getTransition,
  getTransitionProps,
  getTransitionStyle,
  reflow,
} from '../transitions/utils';

export interface GrowProps extends TransitionProps {}

const styles = {
  exited: {
    opacity: 0,
    transform: 'scale(0.75, 0.5)',
    visibility: 'hidden',
  },
};

export function Grow({
  appear = true,
  timeout = 350,
  children,
  onEnter,
  onEntering,
  onEntered,
  onExit,
  ...props
}: GrowProps) {
  const handleEnter = (node: HTMLElement, isAppearing: boolean) => {
    const style = node.style;
    const { easing, duration, delay } = getTransitionProps('enter', {
      timeout,
      style,
    });

    reflow(node);

    style.visibility = '';
    style.transition = [
      getTransition('opacity', { easing, duration, delay }),
      getTransition('transform', { easing, duration: duration * 0.666, delay }),
    ].join(',');

    if (onEnter) {
      onEnter(node, isAppearing);
    }
  };

  const handleEntering = (node: HTMLElement, isAppearing: boolean) => {
    node.style.opacity = '1';
    node.style.transform = 'scale(1, 1)';

    if (onEntering) {
      onEntering(node, isAppearing);
    }
  };

  const handleEntered = (node: HTMLElement, isAppearing: boolean) => {
    node.style.opacity = '1';
    node.style.transform = 'none';

    if (onEntered) {
      onEntered(node, isAppearing);
    }
  };

  const handleExit = (node: HTMLElement) => {
    const style = node.style;
    const { easing, duration, delay } = getTransitionProps('exit', {
      timeout,
      style,
    });

    style.opacity = '0';
    style.transform = 'scale(0.75, 0.5)';
    style.transition = [
      getTransition('opacity', { easing, duration, delay }),
      getTransition('transform', {
        easing,
        duration: duration * 0.666,
        delay: delay || duration * 0.333,
      }),
    ].join(',');

    if (onExit) {
      onExit(node);
    }
  };

  return (
    <Transition
      in={props.in}
      timeout={timeout}
      onEnter={handleEnter}
      onEntering={handleEntering}
      onEntered={handleEntered}
      onExit={handleExit}
      {...props}
    >
      {state => {
        if (React.isValidElement(children)) {
          const style = getTransitionStyle(state, styles as any, children);
          return React.cloneElement(children, {
            style,
          });
        }
      }}
    </Transition>
  );
}
