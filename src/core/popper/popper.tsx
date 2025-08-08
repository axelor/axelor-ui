import {
  arrow as arrowMiddleware,
  autoUpdate,
  flip,
  hide,
  offset as offsetMiddleware,
  Placement,
  useFloating,
} from "@floating-ui/react";
import { useEffect, useRef, useState } from "react";

import { Box } from "../box";
import { Fade } from "../fade";
import { Portal } from "../portal";

import { clsx } from "../clsx";
import { useClassNames, useTheme } from "../styles";
import { TBackground, TForeground } from "../system";
import { TransitionProps } from "../transitions";

import styles from "./popper.module.css";

export type PopperPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "start"
  | "start-top"
  | "start-bottom"
  | "end"
  | "end-top"
  | "end-bottom";

export interface PopperProps {
  open?: boolean;
  target: HTMLElement | null;
  container?: Element | null | (() => Element | null);
  className?: string;
  children?: React.ReactNode;
  placement?: PopperPlacement;
  strategy?: "absolute" | "fixed";
  offset?: [number, number];
  arrow?: boolean;
  shadow?: boolean;
  rounded?: boolean;
  border?: boolean;
  role?: string;
  bg?: TBackground;
  color?: TForeground;
  transition?:
    | null
    | React.ExoticComponent<TransitionProps>
    | React.FunctionComponent<TransitionProps>;
  disablePortal?: boolean;
  contentClassName?: string;
}

const PlacementMapping: Record<PopperPlacement, Placement> = {
  start: "left",
  "start-top": "left-start",
  "start-bottom": "left-end",
  end: "right",
  "end-top": "right-start",
  "end-bottom": "right-end",
  top: "top",
  "top-start": "top-start",
  "top-end": "top-end",
  bottom: "bottom",
  "bottom-start": "bottom-start",
  "bottom-end": "bottom-end",
};

export function Popper(props: PopperProps) {
  const { container, disablePortal, ...rest } = props;

  if (disablePortal) {
    return <PopperInner {...rest} />;
  }

  return (
    <Portal container={container}>
      <PopperInner {...rest} />
    </Portal>
  );
}

function PopperInner(props: PopperProps) {
  const { open, transition, ...rest } = props;
  const Transition = transition || Fade;
  const [exited, setExited] = useState(true);

  const handleEnter = () => {
    setExited(false);
  };

  const handleExited = () => {
    setExited(true);
  };

  if (props.target === null) return null;
  if (exited && !open) return null;

  return (
    <Transition
      in={open}
      appear
      mountOnEnter
      unmountOnExit
      onEnter={handleEnter}
      onExited={handleExited}
    >
      <div>
        <PopperElement {...rest} />
      </div>
    </Transition>
  );
}

function PopperElement({
  target,
  placement: popperPlacement = "bottom",
  offset,
  strategy = "absolute",
  className,
  arrow,
  rounded = true,
  shadow = true,
  border = true,
  role = "tooltip",
  bg = "body",
  color = "body",
  children,
  contentClassName,
  ...props
}: PopperProps) {
  const { dir } = useTheme();
  const classNames = useClassNames();

  const placement = PlacementMapping[popperPlacement];
  const [skidding = 0, distance = 0] = offset || [];
  const arrowPadding = arrow ? 8.5 : 0; // match with .arrow diagonal (12 * Math.sqrt(2) / 2)

  const arrowRef = useRef<HTMLSpanElement | null>(null);
  const {
    x,
    y,
    refs,
    middlewareData,
    strategy: floatingStrategy,
    placement: currentPlacement,
  } = useFloating({
    whileElementsMounted: (referenceEl, floatingEl, update) => {
      return autoUpdate(referenceEl, floatingEl, update);
    },
    placement,
    strategy,
    middleware: [
      offsetMiddleware({
        mainAxis: distance + arrowPadding,
        crossAxis: skidding,
      }),
      flip(),
      hide(),
      ...(arrow ? [arrowMiddleware({ element: arrowRef })] : []),
    ],
  });

  useEffect(() => {
    if (target) {
      refs.setReference(target);
    }
  }, [target, refs]);

  const side = currentPlacement.split("-")[0];

  const staticSide = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  }[side] as string;

  return (
    <div
      ref={refs.setFloating}
      className={classNames(styles.popper, className, {
        "drop-shadow-md": shadow,
        [styles.border]: border,
      })}
      data-popper-placement={currentPlacement}
      {...(dir === "rtl" ? { dir: "rtl" } : {})}
      {...props}
      style={{ position: floatingStrategy, top: y ?? "", left: x ?? "" }}
    >
      <Box
        className={styles.wrapper}
        role={role}
        bg={bg}
        color={color}
        rounded={rounded}
      >
        <div className={contentClassName}>{children}</div>
        {arrow && (
          <span
            ref={arrowRef}
            className={clsx(
              "AxPopper_arrow",
              styles.arrow,
              styles[`${staticSide}-arrow`],
            )}
            style={{
              left: middlewareData?.arrow?.x ?? "",
              top: middlewareData?.arrow?.y ?? "",
              right: "",
              bottom: "",
              [staticSide]: `${-(arrowRef?.current?.offsetWidth ?? 0) / 2}px`,
            }}
          />
        )}
      </Box>
    </div>
  );
}
