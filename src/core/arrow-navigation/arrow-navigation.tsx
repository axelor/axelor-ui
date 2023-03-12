import * as React from "react";
import { useRefs } from "../hooks";
import { useTheme } from "../styles";
import {
  ownerDocument,
  getNextElement,
  getPrevElement,
  navigate,
  isElementDisabled,
  isElementHidden,
} from "./utils";

export interface ArrowNavigationProps {
  children: React.ReactElement;
  enabled?: boolean;
  selector: "auto-horizontal" | "auto-vertical" | (() => HTMLElement[][]);
}

const LAYOUT = {
  HORIZONTAL: "auto-horizontal",
  VERTICAL: "auto-vertical",
};

export const ArrowNavigation = React.forwardRef(
  ({ children, enabled = true, selector }: ArrowNavigationProps, ref) => {
    const nodeRef = React.useRef<HTMLElement>();
    const isAutoLayout = [LAYOUT.HORIZONTAL, LAYOUT.VERTICAL].includes(
      selector as string
    );

    const { dir } = useTheme();
    const rtl = dir === "rtl";

    function handleKeyDown(e: KeyboardEvent) {
      // get selector elements
      const elements =
        !isAutoLayout && typeof selector === "function" && selector();
      const list = nodeRef.current || null;

      if (isAutoLayout) {
        const prevKey =
          selector === LAYOUT.HORIZONTAL
            ? rtl
              ? "ArrowRight"
              : "ArrowLeft"
            : "ArrowUp";
        const nextKey =
          selector === LAYOUT.HORIZONTAL
            ? rtl
              ? "ArrowLeft"
              : "ArrowRight"
            : "ArrowDown";
        const activeElement = ownerDocument(list).activeElement as HTMLElement;

        if (
          activeElement?.parentNode !== nodeRef.current &&
          activeElement !== nodeRef.current
        ) {
          return;
        }

        if ([prevKey, nextKey].includes(e.key)) {
          e.preventDefault();
        }

        const perform = (activeElement: HTMLElement) => {
          let element: any = null;

          if (e.key === prevKey) {
            element = getPrevElement(list, activeElement);
          } else if (e.key === nextKey) {
            element = getNextElement(list, activeElement);
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
        };

        perform(activeElement);
      } else if (elements) {
        const cell = navigate(elements, e.key, rtl);

        if (cell) {
          e.preventDefault();
          cell.focus();
        }
      }

      if (children.props.onKeyDown) {
        children.props.onKeyDown(e);
      }
    }

    // @ts-expect-error
    const handleRef = useRefs(ref, children?.ref, nodeRef);

    return enabled
      ? React.cloneElement(children, {
          onKeyDown: handleKeyDown,
          ref: handleRef,
          tabIndex: 1,
        })
      : children;
  }
);
