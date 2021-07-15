import React from 'react';
import { Transition } from 'react-transition-group';
import { TransitionProps } from '../transitions/types';
import { reflow } from '../transitions/utils';

import { styleNames } from '../styles';

import styles from './fade.module.css';

export interface FadeProps extends TransitionProps {
  children?: React.ReactElement;
}

export const Fade = React.forwardRef<HTMLDivElement, FadeProps>(
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
        return timeout[status];
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
      node.style.opacity = 1;
      node.style.transitionDuration = `${getDuration('enter')}ms`;
      if (onEnter) {
        onEnter(node, isAppearing);
      }
    });

    const handleEntering = transitionHandler(onEntering);

    const handleEntered = transitionHandler(onEntered);

    const handleExit = transitionHandler((node: any) => {
      node.style.opacity = 0;
      node.style.transitionDuration = `${getDuration('exit')}ms`;
      if (onExit) {
        onExit(node);
      }
    });

    const handleExiting = transitionHandler(onExiting);

    const handleExited = transitionHandler((node: any) => {
      if (onExited) {
        onExited(node);
      }
    });

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
          const className = styleNames(styles.fade, {
            [styles.fadeExited]: state === 'exited',
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
