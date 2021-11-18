import { isValidElement, cloneElement } from 'react';
import { Transition } from 'react-transition-group';
import { TransitionProps } from '../transitions/types';
import {
  getTransition,
  getTransitionProps,
  getTransitionStyle,
  reflow,
} from '../transitions/utils';

export interface FadeProps extends TransitionProps {}

const styles = {
  exited: {
    opacity: 0,
    visibility: 'hidden',
  },
};

export function Fade({
  appear = true,
  timeout = 350,
  children,
  onEnter,
  onExit,
  ...props
}: FadeProps) {
  const handleEnter = (node: HTMLElement, isAppearing: boolean) => {
    const style = node.style;
    const options = getTransitionProps('enter', {
      timeout,
      style,
    });

    reflow(node);

    style.opacity = '1';
    style.visibility = '';
    style.transition = getTransition('opacity', options);

    if (onEnter) {
      onEnter(node, isAppearing);
    }
  };

  const handleExit = (node: HTMLElement) => {
    const style = node.style;
    const options = getTransitionProps('exit', {
      timeout,
      style,
    });

    style.opacity = '0';
    style.transition = getTransition('opacity', options);

    if (onExit) {
      onExit(node);
    }
  };

  return (
    <Transition
      in={props.in}
      appear={appear}
      timeout={timeout}
      onEnter={handleEnter}
      onExit={handleExit}
      {...props}
    >
      {state => {
        if (isValidElement(children)) {
          const style = getTransitionStyle(state, styles as any, children);
          return cloneElement(children, {
            style,
          });
        }
      }}
    </Transition>
  );
}
