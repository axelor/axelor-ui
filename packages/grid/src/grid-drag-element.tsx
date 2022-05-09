import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useClassNames } from '@axelor-ui/core';
import * as TYPES from './types';
import classes from './grid.module.css';

const DND_TYPES = {
  ELEMENT: 'GROUP_DRAG_ELEMENT',
};

interface DropObject extends TYPES.GridColumn {
  $group?: boolean;
}

export type DropHandler = (destination: DropObject, target: DropObject) => void;

export interface GridDragElementProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrop'> {
  canDrag?: boolean;
  canDrop?: boolean;
  column?: TYPES.GridColumn;
  onDrop?: DropHandler;
}

const GridDragElementComponent = React.memo(function GridDragElementComponent(
  props: GridDragElementProps
) {
  const { canDrag = true, canDrop, className, column, onDrop, ...rest } = props;
  const ref = React.useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: DND_TYPES.ELEMENT,
      item: column,
      canDrag: () => canDrag,
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item: any, monitor: any) => {
        if (!monitor.didDrop()) {
          return;
        }
        const dropResult = monitor.getDropResult();
        if (dropResult) {
          onDrop && onDrop((props as any).column, (dropResult as any).column);
        }
      },
    }),
    [canDrag, column, onDrop]
  );

  const [{ isOver, isOverCurrent }, drop] = useDrop(
    () => ({
      accept: DND_TYPES.ELEMENT,
      drop: (item, monitor) => {
        if (monitor.didDrop()) {
          return;
        }
        return props;
      },
      canDrop(_item, monitor) {
        const item: any = monitor.getItem();
        return item.name !== (column || {}).name;
      },
      collect: monitor => {
        const item: any = monitor.getItem();
        const canOver =
          (!item?.$group && !column) ||
          (item?.$group && (column as DropObject)?.$group);
        return {
          isOver: canOver && monitor.isOver(),
          isOverCurrent: canOver && monitor.isOver({ shallow: true }),
        };
      },
    }),
    [column]
  );

  drag(drop(ref));

  const classNames = useClassNames();

  return (
    <div
      ref={ref}
      className={classNames(className, classes.dragElement, {
        [classes['drag-over-current']]: isOver || isOverCurrent,
        [classes.dragging]: isDragging,
      })}
      {...rest}
    />
  );
});

export default GridDragElementComponent;
