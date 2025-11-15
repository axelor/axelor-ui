import { forwardRef, useRef } from "react";
import { Transition } from "react-transition-group";

import { useRefs } from "../hooks";
import { useClassNames } from "../styles";
import { findAriaProp } from "../system";
import { TransitionProps } from "../transitions/types";
import {
  getTransition,
  getTransitionProps,
  reflow,
} from "../transitions/utils";

import styles from "./collapse.module.css";

export interface CollapseProps extends TransitionProps {
  horizontal?: boolean;
  className?: string;
}

export const Collapse = forwardRef<HTMLDivElement, CollapseProps>(
  (
    {
      horizontal,
      timeout = 300,
      children,
      className,
      onEnter,
      onEntering,
      onEntered,
      onExit,
      onExiting,
      onExited,
      ...props
    },
    ref,
  ) => {
    const nodeRef = useRef<HTMLDivElement>(null);
    const combinedRef = useRefs(ref, nodeRef);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const size = horizontal ? "width" : "height";

    const getWrapperSize = () => {
      const wrapper = wrapperRef.current;
      if (wrapper) {
        const position = wrapper.style.position;
        const visibility = wrapper.style.visibility;
        const side = horizontal ? "clientWidth" : "clientHeight";
        try {
          wrapper.style.visibility = "hidden";
          wrapper.style.position = "absolute";
          return wrapper[side];
        } finally {
          wrapper.style.position = position;
          wrapper.style.visibility = visibility;
        }
      }
      return 0;
    };

    function handleEnter(isAppearing: boolean) {
      const node = nodeRef.current!;
      node.style[size] = "0";
      if (onEnter) {
        onEnter(node, isAppearing);
      }
    }

    const handleEntering = (isAppearing: boolean) => {
      const node = nodeRef.current!;
      const style = node.style;
      const wrapperSize = getWrapperSize();
      const options = getTransitionProps("enter", { timeout, style });

      node.style[size] = `${wrapperSize}px`;
      node.style.transition = getTransition(size, options);

      if (onEntering) {
        onEntering(node, isAppearing);
      }
    };

    const handleEntered = (isAppearing: boolean) => {
      const node = nodeRef.current!;
      node.style[size] = "auto";

      if (onEntered) {
        onEntered(node, isAppearing);
      }
    };

    const handleExit = () => {
      const node = nodeRef.current!;
      const wrapperSize = getWrapperSize();

      node.style[size] = `${wrapperSize}px`;
      reflow(node);

      if (onExit) {
        onExit(node);
      }
    };

    const handleExiting = () => {
      const node = nodeRef.current!;
      const style = node.style;
      const options = getTransitionProps("exit", { timeout, style });

      node.style[size] = "0";
      node.style.transition = getTransition(size, options);

      if (onExiting) {
        onExiting(node);
      }
    };

    const handleExited = () => {
      const node = nodeRef.current!;
      if (onExited) {
        onExited(node);
      }
    };

    const classNames = useClassNames();

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
        nodeRef={nodeRef}
        {...props}
      >
        {(state) => {
          const cls = classNames([
            className,
            styles.collapse,
            {
              [styles.collapseH]: !horizontal,
              [styles.collapseW]: !!horizontal,
              [styles.collapseEntered]: state === "entered",
              [styles.collapseExited]: state === "exited",
            },
          ]);
          const isCollapsed = state === "exited" || state === "exiting";
          return (
            <div
              className={cls}
              ref={combinedRef}
              aria-hidden={isCollapsed || findAriaProp(props, "aria-hidden")}
            >
              <div ref={wrapperRef} className={styles.collapseWrapper}>
                <div className={styles.collapseWrapperInner}>
                  {typeof children === "function" && children(state)}
                  {typeof children !== "function" && children}
                </div>
              </div>
            </div>
          );
        }}
      </Transition>
    );
  },
);
