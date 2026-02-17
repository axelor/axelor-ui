import { ReactPortal } from "react";
import * as React from "react";
import { createPortal } from "react-dom";

export interface PortalProps {
  container?: Element | null | (() => Element | null);
  children?: React.ReactNode;
}

export const Portal = ({
  container = document.body,
  children,
}: PortalProps): ReactPortal | null => {
  const mountNode = React.useMemo(() => {
    let node = container;
    if (typeof container === "function") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      node = (container as Function)();
    }
    return node as Element;
  }, [container]);

  return mountNode ? createPortal(children, mountNode) : null;
};
