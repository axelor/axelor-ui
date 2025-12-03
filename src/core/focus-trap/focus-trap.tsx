import * as focusTrap from "focus-trap";
import { type Options as FocusTrapOptions } from "focus-trap";
import * as React from "react";
import { useRefs } from "../hooks";
import { WithChildrenProps } from "../system";

export type FocusTarget = FocusTrapOptions["initialFocus"];

export interface FocusTrapProps<T extends React.ElementType = "div">
  extends WithChildrenProps<T>,
    Pick<
      FocusTrapOptions,
      "initialFocus" | "allowOutsideClick" | "clickOutsideDeactivates"
    > {
  enabled?: boolean;
}

export const FocusTrap = React.forwardRef<HTMLDivElement, FocusTrapProps>(
  (
    {
      enabled = true,
      children,
      initialFocus,
      clickOutsideDeactivates,
      allowOutsideClick = true,
    }: FocusTrapProps,
    ref,
  ) => {
    const childrenRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
      const children = childrenRef.current;
      if (children && enabled) {
        const trap = focusTrap.createFocusTrap(children, {
          returnFocusOnDeactivate: true,
          allowOutsideClick,
          fallbackFocus: children,
          escapeDeactivates: false,
          clickOutsideDeactivates,
          initialFocus,
        });
        trap.activate();
        return () => {
          trap.deactivate();
        };
      }
    }, [enabled, initialFocus, allowOutsideClick, clickOutsideDeactivates]);

    const handleRef = useRefs<HTMLDivElement>(
      ref,
      children?.props?.ref,
      childrenRef,
    );

    return React.cloneElement(children, {
      ref: handleRef,
    });
  },
);
