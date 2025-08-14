import { cloneElement, forwardRef } from "react";
import { useRefs } from "../hooks";
import { useOverflowItem } from "./hooks";

export type OverflowItemProps = {
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
  /**
   * The single child that has overflow item behavior attached.
   */
  children: React.ReactElement<any>;
};

export const OverflowItem = forwardRef((props: OverflowItemProps, ref) => {
  const { id, groupId, priority, children } = props;
  const containerRef = useOverflowItem(id, priority, groupId);

  return cloneElement(children, {
    ref: useRefs(containerRef, ref),
  });
});
