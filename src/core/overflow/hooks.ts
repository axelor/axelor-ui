import {
  ObserveOptions,
  OnUpdateItemVisibility,
  OnUpdateOverflow,
  OverflowDividerEntry,
  OverflowItemEntry,
  OverflowManager,
  createOverflowManager,
} from "@fluentui/priority-overflow";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  DATA_OVERFLOWING,
  DATA_OVERFLOW_DIVIDER,
  DATA_OVERFLOW_ITEM,
  DATA_OVERFLOW_MENU,
} from "./contants";
import { useOverflowContext } from "./context";

export function useOverflowContainer<E extends HTMLElement>(
  update: OnUpdateOverflow,
  options: Omit<ObserveOptions, "onUpdateOverflow">
) {
  const {
    overflowAxis,
    overflowDirection,
    padding,
    minimumVisible,
    onUpdateItemVisibility,
  } = options;

  const containerRef = useRef<E>(null);
  const updateOverflowItems = update;

  const [overflowManager] = useState<OverflowManager>(() =>
    createOverflowManager()
  );

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    if (overflowManager) {
      overflowManager.observe(containerRef.current, {
        overflowDirection: overflowDirection ?? "end",
        overflowAxis: overflowAxis ?? "horizontal",
        padding: padding ?? 10,
        minimumVisible: minimumVisible ?? 0,
        onUpdateItemVisibility: onUpdateItemVisibility ?? (() => undefined),
        onUpdateOverflow: updateOverflowItems ?? (() => undefined),
      });

      return () => {
        overflowManager.disconnect();
      };
    }
  }, [
    minimumVisible,
    onUpdateItemVisibility,
    overflowAxis,
    overflowDirection,
    overflowManager,
    padding,
    updateOverflowItems,
  ]);

  const registerItem = useCallback(
    (item: OverflowItemEntry) => {
      overflowManager?.addItem(item);
      item.element.setAttribute(DATA_OVERFLOW_ITEM, "");

      return () => {
        item.element.removeAttribute(DATA_OVERFLOWING);
        item.element.removeAttribute(DATA_OVERFLOW_ITEM);
        overflowManager?.removeItem(item.id);
      };
    },
    [overflowManager]
  );

  const updateOverflow = useCallback(() => {
    overflowManager?.update();
  }, [overflowManager]);

  const registerDivider = useCallback(
    (divider: OverflowDividerEntry) => {
      const el = divider.element;
      overflowManager?.addDivider(divider);
      el && el.setAttribute(DATA_OVERFLOW_DIVIDER, "");

      return () => {
        divider.groupId && overflowManager?.removeDivider(divider.groupId);
        el.removeAttribute(DATA_OVERFLOW_DIVIDER);
      };
    },
    [overflowManager]
  );

  const registerOverflowMenu = useCallback(
    (el: HTMLElement) => {
      overflowManager?.addOverflowMenu(el);
      el.setAttribute(DATA_OVERFLOW_MENU, "");

      return () => {
        overflowManager?.removeOverflowMenu();
        el.removeAttribute(DATA_OVERFLOW_MENU);
      };
    },
    [overflowManager]
  );

  return {
    containerRef,
    registerItem,
    updateOverflow,
    registerOverflowMenu,
    registerDivider,
  };
}

export function useOverflowItem<E extends HTMLElement>(
  id: string,
  priority?: number,
  groupId?: string
) {
  const ref = useRef<E>(null);
  const registerItem = useOverflowContext((v) => v.registerItem);

  useLayoutEffect(() => {
    if (ref.current) {
      return registerItem({
        element: ref.current,
        id,
        priority: priority ?? 0,
        groupId,
      });
    }
  }, [id, priority, registerItem, groupId]);

  return ref;
}

export function useOverflowDivider<TElement extends HTMLElement>(
  groupId?: string
) {
  const ref = useRef<TElement>(null);
  const registerDivider = useOverflowContext((v) => v.registerDivider);

  useLayoutEffect(() => {
    if (ref.current && groupId) {
      return registerDivider({
        element: ref.current,
        groupId,
      });
    }
  }, [registerDivider, groupId]);

  return ref;
}

export const useOverflowCount = () =>
  useOverflowContext((v) => {
    return Object.entries(v.itemVisibility).reduce((acc, [id, visible]) => {
      if (!visible) {
        acc++;
      }
      return acc;
    }, 0);
  });

export function useOverflowMenu<TElement extends HTMLElement>(id?: string) {
  const overflowCount = useOverflowCount();
  const registerOverflowMenu = useOverflowContext(
    (v) => v.registerOverflowMenu
  );
  const updateOverflow = useOverflowContext((v) => v.updateOverflow);
  const ref = useRef<TElement>(null);
  const isOverflowing = overflowCount > 0;

  useLayoutEffect(() => {
    if (ref.current) {
      return registerOverflowMenu(ref.current);
    }
  }, [registerOverflowMenu, isOverflowing, id]);

  useLayoutEffect(() => {
    if (isOverflowing) {
      updateOverflow();
    }
  }, [isOverflowing, updateOverflow, ref]);

  return { ref, overflowCount, isOverflowing };
}

export function useIsOverflowItemVisible(id: string): boolean {
  return !!useOverflowContext((ctx) => ctx.itemVisibility[id]);
}

export const updateVisibilityAttribute: OnUpdateItemVisibility = ({
  item,
  visible,
}) => {
  if (visible) {
    item.element.removeAttribute(DATA_OVERFLOWING);
  } else {
    item.element.setAttribute(DATA_OVERFLOWING, "");
  }
};
