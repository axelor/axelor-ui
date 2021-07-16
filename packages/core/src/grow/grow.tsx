import React from 'react';
import { Transition } from 'react-transition-group';
import { TransitionProps, TransitionHandlerProps } from '../transitions/types';
import { reflow } from '../transitions/utils';

import { styleNames } from '../styles';

import styles from './grow.module.css';

export interface GrowProps extends TransitionProps {
  children?: React.ReactElement;
}

export const Grow = React.forwardRef<HTMLDivElement, GrowProps>(
  (
    {
      children,
      timeout = 300,
      in: isIn,
      onEnter,
      onEntering,
      onEntered,
      onExit,
      onExiting,
      onExited,
      ...props
    },
    ref
  ) => {
    const nodeRef = React.useRef<HTMLDivElement | null>(null);

    const getDuration = (status: 'enter' | 'exit') => {
      if (typeof timeout === 'object') {
        return timeout[status] || 350;
      }
      return timeout;
    };

    const transitionHandler = (callback: any) => (isAppearing?: boolean) => {
      if (callback) {
        const node = nodeRef.current;
        if (callback) {
          callback(node);
        } else {
          callback(node, isAppearing);
        }
      }
    };

    const handleRef = (elem: HTMLDivElement) => {
      nodeRef.current = elem;
      if (typeof ref === 'function') {
        ref(elem);
      } else if (ref) {
        ref.current = elem;
      }
    };

    const handleEnter = transitionHandler((node: any, isAppearing: boolean) => {
      reflow(node);
      const duration = getDuration('enter');

      node.style.opacity = 1;
      node.style.transitionDuration = `${duration}ms, ${duration * .666}ms`;
      node.style.transitionDelay = `0ms, 0ms`;
      node.style.transform = 'none';

      if (onEnter) {
        onEnter(node, isAppearing);
      }
    });

    const handleEntering = transitionHandler(onEntering);

    const handleEntered = transitionHandler(onEntered);

    const handleExit = transitionHandler((node: any) => {
      const duration = getDuration('exit');

      node.style.opacity = 0;
      node.style.transitionDuration = `${duration}ms, ${duration * .666}ms`;
      node.style.transitionDelay = `0ms, ${duration * .333}ms`;
      node.style.transform = `scale(0.75, 0.5)`;

      if (onExit) {
        onExit(node);
      }
    });

    const handleExiting = transitionHandler(onExiting);

    const handleExited = transitionHandler(onExited);

    return (
      <Transition
        in={isIn}
        timeout={timeout}
        nodeRef={nodeRef}
        onEnter={handleEnter}
        onEntering={handleEntering}
        onEntered={handleEntered}
        onExit={handleExit}
        onExiting={handleExiting}
        onExited={handleExited}
        {...props}
      >
        {state => {
          const className = styleNames(styles.grow, {
            [styles.growEntering]: state === 'entering',
            [styles.growEntered]: state === 'entered',
            [styles.growExited]: state === 'exited',
          });
          return React.cloneElement(children as any, {
            className: className,
            ref: handleRef,
          });
        }}
      </Transition>
    );
  }
);
