import * as React from 'react';
import { Transition } from 'react-transition-group';
import { TransitionProps } from '../transitions/types';
import {
  getTransition,
  getTransitionProps,
  reflow,
} from '../transitions/utils';

import { styleNames } from '../styles';

import styles from './collapse.module.css';

export interface CollapseProps extends TransitionProps {
  horizontal?: boolean;
  children?: React.ReactNode;
}

export const Collapse = ({
  horizontal,
  timeout = 300,
  children,
  onEnter,
  onEntering,
  onEntered,
  onExit,
  onExiting,
  onExited,
  ...props
}: CollapseProps) => {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const size = horizontal ? 'width' : 'height';

  const getWrapperSize = () => {
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

  const handleEnter = (node: HTMLElement, isAppearing: boolean) => {
    node.style[size] = '0';
    if (onEnter) {
      onEnter(node, isAppearing);
    }
  };

  const handleEntering = (node: HTMLElement, isAppearing: boolean) => {
    const style = node.style;
    const wrapperSize = getWrapperSize();
    const options = getTransitionProps('enter', { timeout, style });

    node.style[size] = `${wrapperSize}px`;
    node.style.transition = getTransition(size, options);

    if (onEntering) {
      onEntering(node, isAppearing);
    }
  };

  const handleEntered = (node: HTMLElement, isAppearing: boolean) => {
    node.style[size] = 'auto';

    if (onEntered) {
      onEntered(node, isAppearing);
    }
  };

  const handleExit = (node: HTMLElement) => {
    const wrapperSize = getWrapperSize();

    node.style[size] = `${wrapperSize}px`;
    reflow(node);

    if (onExit) {
      onExit(node);
    }
  };

  const handleExiting = (node: HTMLElement) => {
    const style = node.style;
    const options = getTransitionProps('exit', { timeout, style });

    node.style[size] = '0';
    node.style.transition = getTransition(size, options);

    if (onExiting) {
      onExiting(node);
    }
  };

  const handleExited = (node: HTMLElement) => {
    if (onExited) {
      onExited(node);
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
          <div className={className}>
            <div ref={wrapperRef} className={styles.collapseWrapper}>
              <div className={styles.collapseWrapperInner}>{children}</div>
            </div>
          </div>
        );
      }}
    </Transition>
  );
};
