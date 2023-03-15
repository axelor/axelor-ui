import { createPopper, Instance, Placement } from "@popperjs/core";
import { useEffect, useMemo, useRef, useState } from "react";

import { Box } from "../box";
import { Fade } from "../fade";
import { Portal } from "../portal";

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
  children?: React.ReactNode;
  placement?: PopperPlacement;
  strategy?: "absolute" | "fixed";
  offset?: [number, number];
  arrow?: boolean;
  shadow?: boolean;
  rounded?: boolean;
  role?: string;
  bg?: TBackground;
  color?: TForeground;
  transition?:
    | null
    | React.ExoticComponent<TransitionProps>
    | React.FunctionComponent<TransitionProps>;
  disablePortal?: boolean;
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

const PopperWrapper = ({
  open,
  target,
  placement: popperPlacement = "bottom",
  strategy = "absolute",
  offset,
  arrow,
  shadow,
  children,
  ...props
}: PopperProps) => {
  const instance = useRef<Instance | null>(null);
  const [wrapperEl, setWrapperEl] = useState<HTMLDivElement | null>(null);
  const { dir } = useTheme();

  const placement = PlacementMapping[popperPlacement];
  const [skidding = 0, distance = 0] = offset || [];

  const enabled = Boolean(offset) || Boolean(arrow);
  const arrowEnabled = Boolean(arrow);

  const modifiers = useMemo(() => {
    const arrowPadding = arrowEnabled ? 6 : 0; // match with .arrow css
    return [
      { name: "preventOverflow" },
      { name: "flip" },
      {
        name: "offset",
        enabled,
        options: {
          offset: [skidding, distance + arrowPadding],
        },
      },
      {
        name: "arrow",
        enabled: arrowEnabled,
      },
    ];
  }, [skidding, distance, enabled, arrowEnabled]);

  useEffect(() => {
    instance.current?.forceUpdate();
  });

  useEffect(() => {
    if (!open || target === null || wrapperEl === null) {
      return undefined;
    }

    instance.current = createPopper(target, wrapperEl, {
      placement,
      strategy,
      modifiers,
    });

    return () => {
      instance.current?.destroy();
      instance.current = null;
    };
  }, [target, wrapperEl, open, placement, strategy, modifiers]);

  const classNames = useClassNames();

  return (
    <div
      ref={setWrapperEl}
      className={classNames(styles.popper, { "drop-shadow-md": shadow })}
      {...(dir === "rtl" ? { dir: "rtl" } : {})}
      {...props}
      style={{ position: "fixed" }}
    >
      {children}
    </div>
  );
};

export const Popper = ({
  open,
  placement = "bottom",
  arrow,
  rounded = true,
  shadow = true,
  role = "tooltip",
  bg = "light",
  color = "body",
  container,
  transition: Transition = Fade,
  children,
  disablePortal,
  ...props
}: PopperProps) => {
  const [exited, setExited] = useState(true);

  const handleEnter = () => {
    setExited(false);
  };

  const handleExited = () => {
    setExited(true);
  };

  const render = () => {
    return (
      <Box
        className={styles.wrapper}
        role={role}
        bg={bg}
        color={color}
        rounded={rounded}
      >
        <div className={styles.content}>{children}</div>
        {arrow && <span data-popper-arrow className={styles.arrow}></span>}
      </Box>
    );
  };

  if (exited && !open) {
    return null;
  }

  const wrapper = (
    <PopperWrapper
      placement={placement}
      arrow={arrow}
      shadow={shadow}
      open={open || !exited}
      {...props}
    >
      {Transition ? (
        <Transition
          in={open}
          appear
          onEnter={handleEnter}
          onExited={handleExited}
        >
          {render()}
        </Transition>
      ) : (
        render()
      )}
    </PopperWrapper>
  );

  return disablePortal ? (
    wrapper
  ) : (
    <Portal container={container}>{wrapper}</Portal>
  );
};
