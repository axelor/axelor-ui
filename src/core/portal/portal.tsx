import { ReactPortal, useEffect, useState } from "react";
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
  const [mountNode, setMountNode] = useState<Element | null>(null);
  useEffect(() => {
    let node = container;
    if (typeof container === "function") {
      node = (container as Function)();
    }
    setMountNode(node);
  }, [container]);

  return mountNode ? createPortal(children, mountNode) : null;
};
