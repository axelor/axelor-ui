import { useEffect, useState } from 'react';
import * as React from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  container?: Element | null | (() => Element | null);
  children?: React.ReactNode;
}

export const Portal = ({
  container = document.body,
  children,
}: PortalProps) => {
  const [mountNode, setMountNode] = useState<Element | null>(null);
  useEffect(() => {
    let node = container;
    if (typeof node === 'function') {
      node = node();
    }
    setMountNode(node);
  }, [container]);

  return mountNode ? createPortal(children, mountNode) : null;
};
