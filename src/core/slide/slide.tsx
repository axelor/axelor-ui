import { cloneElement, isValidElement, useRef } from "react";
import { Transition } from "react-transition-group";
import { useTheme } from "../styles";
import { TransitionProps } from "../transitions/types";
import {
  getTransition,
  getTransitionProps,
  getTransitionStyle,
  reflow,
} from "../transitions/utils";

type Direction = "start" | "end" | "up" | "down";

export interface SlideProps extends TransitionProps {
  direction?: Direction;
}

const styles = {
  exited: {
    translate: "translateX(-100000px)",
    transform: "none",
    visibility: "hidden",
  },
};

const ownerWindow = (node: HTMLElement) => {
  return (node.ownerDocument || document).defaultView || window;
};

const getDirection = (direction: Direction, dir?: string) => {
  if (dir === "rtl") {
    if (direction === "start") return "end";
    if (direction === "end") return "start";
  }
  return direction;
};

const getTranslateValue = (
  node: HTMLElement,
  directionGiven: Direction,
  dir?: string
) => {
  const view = ownerWindow(node);
  const rect = node.getBoundingClientRect();
  const direction = getDirection(directionGiven, dir);

  const computedStyle = view.getComputedStyle(node);
  const transform =
    computedStyle.getPropertyValue("-webkit-transform") ||
    computedStyle.getPropertyValue("transform");

  let offsetX = 0;
  let offsetY = 0;

  if (typeof transform === "string" && transform !== "none" && transform) {
    const transformValues = transform.split("(")[1].split(")")[0].split(",");
    offsetX = parseInt(transformValues[4], 10);
    offsetY = parseInt(transformValues[5], 10);
  }

  if (direction === "start") {
    return `translateX(${view.innerWidth}px) translateX(${
      offsetX - rect.left
    }px)`;
  }

  if (direction === "end") {
    return `translateX(-${rect.left + rect.width - offsetX}px)`;
  }

  if (direction === "up") {
    return `translateY(${view.innerHeight}px) translateY(${
      offsetY - rect.top
    }px)`;
  }

  // down
  return `translateY(-${rect.top + rect.height - offsetY}px)`;
};

export function Slide({
  timeout = 300,
  direction = "end",
  children,
  onEnter,
  onEntering,
  onEntered,
  onExit,
  onExiting,
  onExited,
  ...props
}: SlideProps) {
  const { dir } = useTheme();
  const nodeRef = useRef(null);
  const handleEnter = (isAppearing: boolean) => {
    const node: HTMLElement = nodeRef.current!;
    node.style.transform = getTranslateValue(node, direction, dir);

    reflow(node);

    if (onEnter) {
      onEnter(node, isAppearing);
    }
  };

  const handleEntering = (isAppearing: boolean) => {
    const node: HTMLElement = nodeRef.current!;
    const style = node.style;
    const options = getTransitionProps("enter", { timeout, style });

    style.visibility = "";
    style.transform = "";
    style.transition = getTransition("transform", options);

    if (onEntering) {
      onEntering(node, isAppearing);
    }
  };

  const handleEntered = (isAppearing: boolean) => {
    const node: HTMLElement = nodeRef.current!;
    if (onEntered) {
      onEntered(node, isAppearing);
    }
  };

  const handleExit = () => {
    const node: HTMLElement = nodeRef.current!;
    node.style.transform = getTranslateValue(node, direction, dir);
    if (onExit) {
      onExit(node);
    }
  };

  const handleExiting = () => {
    const node: HTMLElement = nodeRef.current!;
    const style = node.style;
    const options = getTransitionProps("enter", { timeout, style });

    style.transition = getTransition("transform", options);

    if (onExiting) {
      onExiting(node);
    }
  };

  const handleExited = () => {
    const node: HTMLElement = nodeRef.current!;
    node.style.transform = "translateX(-100000px)";
    node.style.transition = "";
    node.style.visibility = "hidden";
    if (onExited) {
      onExited(node);
    }
  };

  return (
    <Transition
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
        if (isValidElement(children)) {
          const style = getTransitionStyle(state, styles as any, children);
          return cloneElement(children as React.ReactElement, {
            style,
            ref: nodeRef,
          });
        }
      }}
    </Transition>
  );
}
