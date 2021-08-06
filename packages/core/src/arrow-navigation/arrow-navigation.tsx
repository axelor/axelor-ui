import React from 'react';
import { ownerDocument, isElementDisabled, isElementHidden } from './utils';

export interface ArrowNavigationProps {
  children: React.ReactElement;
  enabled?: boolean;
  selector: 'auto-horizontal' | 'auto-vertical' | (() => HTMLElement[][]);
}

const LAYOUT = {
  HORIZONTAL: 'auto-horizontal',
  VERTICAL: 'auto-vertical',
};

export const ArrowNavigation = React.forwardRef(
  ({ children, enabled = true, selector }: ArrowNavigationProps, ref) => {
    const nodeRef = React.useRef<HTMLElement>();
    const isAutoLayout = [LAYOUT.HORIZONTAL, LAYOUT.VERTICAL].includes(
      selector as string
    );

    function hasFocus(element: Node) {
      return element === document.activeElement;
    }

    function handleKeyDown(e: KeyboardEvent) {
      e.preventDefault();
      
      const list = nodeRef.current;
      if (isAutoLayout) {
        const prevKey =
          selector === LAYOUT.HORIZONTAL ? 'ArrowLeft' : 'ArrowUp';
        const nextKey =
          selector === LAYOUT.HORIZONTAL ? 'ArrowRight' : 'ArrowDown';

        if ([prevKey, nextKey].includes(e.key)) {
          e.preventDefault();
        }

        const movePrev = (item: HTMLElement) => {
          if (item && item?.previousElementSibling) {
            return item?.previousElementSibling;
          }
          return list?.lastChild;
        };

        const moveNext = (item: HTMLElement) => {
          if (item && item?.nextElementSibling) {
            return item?.nextElementSibling;
          }
          return list?.firstChild;
        };

        function perform(activeElement: HTMLElement) {
          let element: any = null;

          switch (e.key) {
            case prevKey:
              element = movePrev(activeElement);
              break;
            case nextKey:
              element = moveNext(activeElement);
              break;
          }

          // check element is disabled
          if (
            element &&
            (isElementHidden(element) || isElementDisabled(element))
          ) {
            perform(element);
          } else if (element) {
            (element as HTMLElement).focus();
          }
        }

        perform(ownerDocument(list).activeElement as HTMLElement);
      } else if (typeof selector === 'function') {
        const elements = selector();
        let row: number = -1;
        let col: number = -1;

        for (let i = 0; i < elements.length; i++) {
          const rowElement: any = elements[i];
          if (rowElement.length) {
            for (let j = 0; j < rowElement.length; j++) {
              const element = rowElement[j];
              if (hasFocus(element)) {
                row = i;
                col = j;
                break;
              }
            }
          } else if (hasFocus(rowElement)) {
            row = i;
          }
        }

        const nextRow = () => (row = row === elements.length - 1 ? 0 : row + 1);
        const prevRow = () => (row = row === 0 ? elements.length - 1 : row - 1);
        const moveNext = () => col++;
        const movePrev = () => col--;
        const moveStart = () => (col = 0);
        const moveEnd = () => (col = elements[row].length - 1);
        const isStart = () => col === 0;
        const isEnd = () => col === elements[row].length - 1;
        const hasCol = () => col >= 0;

        function perform(key: string) {
          switch (key) {
            case 'ArrowUp':
              prevRow();
              break;
            case 'ArrowDown':
              nextRow();
              break;
            case 'ArrowLeft':
              if (hasCol()) {
                if (isStart()) {
                  prevRow();
                  moveEnd();
                } else {
                  movePrev();
                }
              } else {
                prevRow();
              }
              break;
            case 'ArrowRight':
              if (hasCol()) {
                if (isEnd()) {
                  nextRow();
                  moveStart();
                } else {
                  moveNext();
                }
              } else {
                nextRow();
              }
              break;
          }
          const focusElement = hasCol() ? elements[row][col] : elements[row];
          if (focusElement) {
            (focusElement as HTMLElement).focus();
            if (!hasFocus(focusElement as Node)) {
              perform(key);
            }
          }
        }
        perform(e.key);
      }

      if (children.props.onKeyDown) {
        children.props.onKeyDown(e);
      }
    }

    const setRef = (ref: any, el: HTMLElement) => {
      if (typeof ref === 'function') {
        ref(el);
      } else if (ref) {
        ref.current = el;
      }
    };

    const handleRef = (el: HTMLElement) => {
      nodeRef.current = el;
      // @ts-expect-error
      setRef(children?.ref, el);
      setRef(ref, el);
    };

    return enabled
      ? React.cloneElement(children, {
          onKeyDown: handleKeyDown,
          ref: handleRef,
          tabIndex: 1,
        })
      : children;
  }
);
