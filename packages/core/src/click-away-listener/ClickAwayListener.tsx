import React from 'react';

export interface ClickAwayListenerProps {
  children: React.ReactElement;
  onClickAway: (event: Event) => void;
}

function clickedRootScrollbar(event: MouseEvent, doc: Document) {
  return (
    doc.documentElement.clientWidth < event.clientX ||
    doc.documentElement.clientHeight < event.clientY
  );
}

export const ClickAwayListener = ({
  children,
  onClickAway,
}: ClickAwayListenerProps) => {
  const nodeRef = React.useRef<HTMLElement | null>(null);
  const activatedRef = React.useRef(false);
  const movedRef = React.useRef(false);
  const syntheticEventRef = React.useRef(false);
  const onClickAwayRef = React.useRef(onClickAway);

  const getDoc = React.useCallback(() => {
    const node = nodeRef.current;
    return (node && node.ownerDocument) || document;
  }, []);

  const createHandleSynthetic =
    (handlerName: string) => (event: React.SyntheticEvent) => {
      syntheticEventRef.current = true;

      const childrenPropsHandler = children.props[handlerName];
      if (childrenPropsHandler) {
        childrenPropsHandler(event);
      }
    };

  const handleRef = (el: HTMLElement) => {
    // @ts-expect-error
    const { ref } = children;
    nodeRef.current = el;
    if (typeof ref === 'function') {
      ref(el);
    } else if (ref) {
      ref.current = el;
    }
  };

  const handleClickAway = React.useCallback(
    (event: MouseEvent | TouchEvent) => {
      const insideReactTree = syntheticEventRef.current;
      const node = nodeRef.current;
      const document = getDoc();

      syntheticEventRef.current = false;
      if (
        !node ||
        !activatedRef.current ||
        ('clientX' in event && clickedRootScrollbar(event, document))
      )
        return;

      if (movedRef.current) {
        movedRef.current = false;
        return;
      }

      let insideDOM;
      if (event.composedPath) {
        insideDOM = event.composedPath().indexOf(node) > -1;
      } else {
        insideDOM =
          !document.documentElement.contains(event.target as HTMLElement) ||
          node.contains(event.target as HTMLElement);
      }

      if (!insideDOM || !insideReactTree) {
        onClickAwayRef.current(event);
      }
    },
    []
  );

  React.useEffect(() => {
    setTimeout(() => {
      activatedRef.current = true;
    }, 0);
    return () => {
      activatedRef.current = false;
    };
  }, []);

  React.useEffect(() => {
    onClickAwayRef.current = onClickAway;
  }, [onClickAway]);

  // handle touch event
  React.useEffect(() => {
    const document = getDoc();
    const handleTouchMove = () => (movedRef.current = true);

    document.addEventListener('touchend', handleClickAway);
    document.addEventListener('touchmove', handleTouchMove);

    return () => {
      document.removeEventListener('touchend', handleClickAway);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleClickAway]);

  // handle mouse event
  React.useEffect(() => {
    const document = getDoc();

    document.addEventListener('click', handleClickAway);
    return () => {
      document.removeEventListener('click', handleClickAway);
    };
  }, [handleClickAway]);

  return React.cloneElement(children, {
    onTouchEnd: createHandleSynthetic('onTouchEnd'),
    onClick: createHandleSynthetic('onClick'),
    ref: handleRef,
  });
};
