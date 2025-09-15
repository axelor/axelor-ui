import { ObserveOptions, OnUpdateOverflow } from "@fluentui/priority-overflow";
import React, { cloneElement, forwardRef, useCallback, useRef } from "react";
import { clsx } from "../clsx";
import { OverflowContext, OverflowState } from "./context";
import { updateVisibilityAttribute, useOverflowContainer } from "./hooks";

import { useRefs } from "../hooks";
import { WithChildrenProps } from "../system";
import styles from "./overflow.module.scss";

export interface OverflowProps<T extends React.ElementType = "div">
  extends WithChildrenProps<T>,
    Pick<
      ObserveOptions,
      "overflowAxis" | "overflowDirection" | "padding" | "minimumVisible"
    > {}

export const Overflow = forwardRef((props: OverflowProps, ref) => {
  const {
    children,
    minimumVisible,
    overflowAxis = "horizontal",
    overflowDirection,
    padding,
  } = props;

  const childrenRef = useRef<HTMLDivElement>(null);
  const [overflowState, setOverflowState] = React.useState<OverflowState>({
    hasOverflow: false,
    itemVisibility: {},
    groupVisibility: {},
  });

  const update: OnUpdateOverflow = useCallback((data) => {
    const { visibleItems, invisibleItems, groupVisibility } = data;
    const itemVisibility: Record<string, boolean> = {};

    visibleItems.forEach((x) => (itemVisibility[x.id] = true));
    invisibleItems.forEach((x) => (itemVisibility[x.id] = false));

    setOverflowState(() => {
      return {
        hasOverflow:
          // is container visible by checking it's offsetWidth
          (childrenRef.current?.offsetWidth ?? 0) > 0 &&
          data.invisibleItems.length > 0,
        itemVisibility,
        groupVisibility,
      };
    });
  }, []);

  const {
    containerRef,
    registerItem,
    updateOverflow,
    registerOverflowMenu,
    registerDivider,
  } = useOverflowContainer(update, {
    overflowDirection,
    overflowAxis,
    padding,
    minimumVisible,
    onUpdateItemVisibility: updateVisibilityAttribute,
  });

  const clonedChild = cloneElement(children, {
    ref: useRefs(childrenRef, containerRef, ref),
    className: clsx(
      styles.overflowMenu,
      styles.overflowingItems,
      children.props.className,
    ),
  });

  return (
    <OverflowContext.Provider
      value={{
        itemVisibility: overflowState.itemVisibility,
        groupVisibility: overflowState.groupVisibility,
        hasOverflow: overflowState.hasOverflow,
        registerItem,
        updateOverflow,
        registerOverflowMenu,
        registerDivider,
      }}
    >
      {clonedChild}
    </OverflowContext.Provider>
  );
});
