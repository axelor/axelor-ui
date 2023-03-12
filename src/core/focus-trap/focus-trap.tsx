import * as React from "react";
import * as focusTrap from "focus-trap";
import { useRefs } from "../hooks";

export interface FocusTrapProps {
  enabled?: boolean;
  children: React.ReactElement;
}

export const FocusTrap = React.forwardRef<HTMLElement, FocusTrapProps>(
  ({ enabled = true, children }: FocusTrapProps, ref) => {
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
        });
        trap.activate();
        return () => {
          trap.deactivate();
        };
      }
    }, [enabled]);

    return React.cloneElement(children, {
      ref: handleRef,
    });
  }
);
