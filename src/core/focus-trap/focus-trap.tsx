import * as focusTrap from "focus-trap";
import * as React from "react";
import { useRefs } from "../hooks";

export type FocusTarget = focusTrap.FocusTargetOrFalse;

export interface FocusTrapProps {
  enabled?: boolean;
  children: React.ReactElement;
  initialFocus?: FocusTarget;
}

export const FocusTrap = React.forwardRef<HTMLElement, FocusTrapProps>(
  ({ enabled = true, children, initialFocus }: FocusTrapProps, ref) => {
    const childrenRef = React.useRef<HTMLElement | null>(null);

    // @ts-expect-error
    const handleRef = useRefs(ref, children?.ref, childrenRef);

    React.useEffect(() => {
      const children: HTMLElement | null = childrenRef.current;
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

    return React.cloneElement(children, {
      ref: handleRef,
    });
  }
);
