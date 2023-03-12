import * as React from "react";
import { TransitionStatus } from "react-transition-group";

export const reflow = (node: Element) => node.scrollTop;

export const easings = {
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
} as const;

export const durations = {
  standard: 300,
  entering: 225,
  leaving: 195,
} as const;

export const getTransitionStyle = (
  state: TransitionStatus,
  styles: {
    [k in TransitionStatus]?: React.CSSProperties;
  },
  children: React.ReactElement
): React.CSSProperties => ({
  ...children.props.style,
  ...styles[state],
});

const getOptionValue = (value: any, mode: string, defaultValue?: any) =>
  (typeof value === "object" ? value[mode] : value) || defaultValue;

const getStyleValue = (value: string | undefined) => {
  if (value === undefined || value === null || value.length === 0) return null;
  return value;
};

export const getTransitionProps = (
  mode: "enter" | "exit",
  options: {
    easing?: string | { enter?: string; exit?: string };
    timeout: number | { enter?: number; exit?: number };
    style: Partial<CSSStyleDeclaration>;
  }
) => {
  const { easing, timeout, style = {} } = options;
  return {
    easing:
      getStyleValue(style.transitionTimingFunction) ??
      getOptionValue(easing, mode),
    duration:
      getStyleValue(style.transitionDuration) ??
      getOptionValue(timeout, mode, 0),
    delay: getStyleValue(style.transitionDelay) || 0,
  };
};

const formatMs = (value: string | number) => {
  if (typeof value === "number") {
    return `${Math.round(value)}ms`;
  }
  return value;
};

export const getTransition = (
  props:
    | "all"
    | keyof React.CSSProperties
    | [keyof React.CSSProperties] = "all",
  options: {
    easing?: string;
    duration?: string | number;
    delay?: string | number;
  } = {}
) => {
  const {
    easing = easings.easeInOut,
    duration = durations.standard,
    delay = 0,
  } = options;
  return [props]
    .flat()
    .map((prop) => `${prop} ${formatMs(duration)} ${easing} ${formatMs(delay)}`)
    .join(",");
};
