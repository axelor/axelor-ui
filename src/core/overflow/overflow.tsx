import { ObserveOptions, OnUpdateOverflow } from "@fluentui/priority-overflow";
import React, { cloneElement, forwardRef, useCallback } from "react";
import { clsx } from "../clsx";
import { OverflowContext, OverflowState } from "./context";
import { updateVisibilityAttribute, useOverflowContainer } from "./hooks";

import { useRefs } from "../hooks";
import styles from "./overflow.module.scss";

export type OverflowProps = Pick<
  ObserveOptions,
  "overflowAxis" | "overflowDirection" | "padding" | "minimumVisible"
> & {
  children: React.ReactElement;
};

export const Overflow = forwardRef((props: OverflowProps, ref) => {
  const {
    children,
    minimumVisible,
    overflowAxis = "horizontal",
    overflowDirection,
    padding,
  } = props;

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
        hasOverflow: data.invisibleItems.length > 0,
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
    ref: useRefs(containerRef, ref),
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
