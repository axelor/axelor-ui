import * as focusTrap from "focus-trap";
import * as React from "react";
import { useRefs } from "../hooks";
import { WithChildrenProps } from "../system";

export type FocusTarget = focusTrap.FocusTargetOrFalse;

export interface FocusTrapProps<T extends React.ElementType = "div">
  extends WithChildrenProps<T> {
  enabled?: boolean;
  initialFocus?: FocusTarget;
}

export const FocusTrap = React.forwardRef<HTMLDivElement, FocusTrapProps>(
  ({ enabled = true, children, initialFocus }: FocusTrapProps, ref) => {
    const childrenRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
      const children = childrenRef.current;
      if (children && enabled) {
        const trap = focusTrap.createFocusTrap(children, {
          returnFocusOnDeactivate: true,
          allowOutsideClick: true,
          fallbackFocus: children,
          escapeDeactivates: false,
          initialFocus,
        });
        trap.activate();
        return () => {
          trap.deactivate();
        };
      }
    }, [enabled, initialFocus]);

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
