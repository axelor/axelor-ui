import React from 'react';
import * as focusTrap from 'focus-trap';

export interface FocusTrapProps {
  enabled?: boolean;
  children: React.ReactElement;
}

export function FocusTrap({ enabled = true, children }: FocusTrapProps) {
  const childrenRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const children: any = childrenRef.current;
    if (children && enabled) {
      const trap: any = focusTrap.createFocusTrap(children, {
        returnFocusOnDeactivate: true,
        allowOutsideClick: true,
        fallbackFocus: children,
      });
      trap.activate();
      return () => trap.deactivate();
    }
  }, [enabled]);

  return React.cloneElement(children, {
    ref: (el: HTMLElement) => {
      // @ts-expect-error
      const { ref } = children;
      childrenRef.current = el;
      if (typeof ref === 'function') {
        ref(el);
      } else if (ref) {
        ref.current = el;
      }
    },
  });
}
