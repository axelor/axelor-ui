import { cloneElement, forwardRef, isValidElement } from "react";
import { Transition } from "react-transition-group";
import { useForwardedRef } from "../hooks";
import { TransitionProps } from "../transitions/types";
import {
  getTransition,
  getTransitionProps,
  getTransitionStyle,
  reflow,
} from "../transitions/utils";

export interface FadeProps extends TransitionProps {}

const styles = {
  exited: {
    opacity: 0,
    visibility: "hidden",
  },
};

export const Fade = forwardRef<HTMLElement, FadeProps>(
  (
    {
      appear = true,
      timeout = 350,
      children,
      onEnter,
      onExit,
      unmountOnExit,
      ...props
    },
    ref
  ) => {
    const nodeRef = useForwardedRef<any>(ref);
    const handleEnter = (isAppearing: boolean) => {
      const node: HTMLElement = nodeRef.current!;
      const style = node.style;
      const options = getTransitionProps("enter", {
        timeout,
        style,
      });

      reflow(node);

      style.opacity = "1";
      style.visibility = "";
      style.transition = getTransition("opacity", options);

      if (onEnter) {
        onEnter(node, isAppearing);
      }
    };

    const handleExit = () => {
      const node: HTMLElement = nodeRef.current!;
      const style = node.style;
      const options = getTransitionProps("exit", {
        timeout,
        style,
      });

      style.opacity = "0";
      style.transition = getTransition("opacity", options);

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
        nodeRef={nodeRef}
        unmountOnExit={unmountOnExit}
        {...props}
      >
        {(state) => {
          if (isValidElement(children)) {
            let style = getTransitionStyle(state, styles as any, children);
            if (unmountOnExit && state === "exited") {
              const { visibility, display, ...rest } = style;
              style = rest;
            }
            return cloneElement(children as React.ReactElement, {
              style,
              ref: nodeRef,
            });
          }
        }}
      </Transition>
    );
  }
);
