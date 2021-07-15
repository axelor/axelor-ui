import React from 'react';
import { Transition } from 'react-transition-group';
import { TransitionProps } from '../transitions/types';
import { reflow } from '../transitions/utils';

import { styleNames } from '../styles';

import styles from './collapse.module.css';

export interface CollapseProps extends TransitionProps {
  horizontal?: boolean;
  children?: React.ReactNode;
}

export const Collapse = React.forwardRef<HTMLDivElement, CollapseProps>(
  (
    {
      children,
      horizontal,
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
    const wrapperRef = React.useRef<HTMLDivElement | null>(null);

    const size = horizontal ? 'width' : 'height';

    const getSize = () => {
      const wrapper = wrapperRef.current;
      if (wrapper && horizontal) {
        wrapper.style.position = 'absolute';
        try {
          return wrapper.clientWidth;
        } finally {
          wrapper.style.position = '';
        }
      }
      if (wrapper) {
        return wrapper.clientHeight;
      }
      return 0;
    };

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
      node.style[size] = 0;
      if (onEnter) {
        onEnter(node, isAppearing);
      }
    });

    const handleEntering = transitionHandler(
      (node: any, isAppearing: boolean) => {
        node.style[size] = `${getSize()}px`;
        node.style.transitionDuration = `${getDuration('enter')}ms`;
        if (onEntering) {
          onEntering(node, isAppearing);
        }
      }
    );

    const handleEntered = transitionHandler(
      (node: any, isAppearing: boolean) => {
        node.style[size] = `auto`;
        if (onEntered) {
          onEntered(node, isAppearing);
        }
      }
    );

    const handleExit = transitionHandler((node: any) => {
      node.style[size] = `${getSize()}px`;
      reflow(node); // force reflow
      if (onExit) {
        onExit(node);
      }
    });

    const handleExiting = transitionHandler((node: any) => {
      node.style[size] = 0;
      node.style.transitionDuration = `${getDuration('exit')}ms`;
      if (onExiting) {
        onExiting(node);
      }
    });

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
          const className = styleNames(styles.collapse, {
            [styles.collapseH]: !horizontal,
            [styles.collapseW]: !!horizontal,
            [styles.collapseEntered]: state === 'entered',
            [styles.collapseExited]: state === 'exited',
          });
          return (
            <div ref={handleRef} className={className}>
              <div ref={wrapperRef} className={styles.collapseWrapper}>
                <div className={styles.collapseWrapperInner}>{children}</div>
              </div>
            </div>
          );
        }}
      </Transition>
    );
  }
);
