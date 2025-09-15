import { cloneElement, forwardRef } from "react";
import { useRefs } from "../hooks";
import { useOverflowItem } from "./hooks";
import { WithChildrenProps } from "../system";

export interface OverflowItemProps<T extends React.ElementType = "div">
  extends WithChildrenProps<T> {
  /**
   * The unique identifier for the item used by the overflow manager.
   */
  id: string;
  /**
   * Assigns the item to a group, group visibility can be watched.
   */
  groupId?: string;
  /**
   * A higher priority means the item overflows later.
   */
  priority?: number;
}

export const OverflowItem = forwardRef((props: OverflowItemProps, ref) => {
  const { id, groupId, priority, children } = props;
  const containerRef = useOverflowItem(id, priority, groupId);

  return cloneElement(children, {
    ref: useRefs(containerRef, ref),
  });
});
