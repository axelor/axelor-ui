import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { styleNames } from '@axelor-ui/core/styles';
import * as TYPES from './types';
import classes from './grid.module.css';

const DND_TYPES = {
  ELEMENT: 'GROUP_DRAG_ELEMENT',
};

interface Object {
  column?: TYPES.GridColumn;
  group?: TYPES.GridGroup;
}

export type DropHandler = (
  destination: Record<'column' | 'group', Object>,
  target: Record<'column' | 'group', Object>
) => void;

export interface GridDragElementProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrop'> {
  canDrag?: boolean;
  column?: TYPES.GridColumn;
  group?: TYPES.GridGroup;
  onDrop?: DropHandler;
}

const GridDragElementComponent = React.memo(function GridDragElementComponent(
  props: GridDragElementProps
) {
  const { canDrag = true, className, column, group, onDrop, ...rest } = props;
  const ref = React.useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: DND_TYPES.ELEMENT,
      item: { ...column, ...group },
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
          onDrop && onDrop(props as any, dropResult);
        }
      },
    }),
    [canDrag, column, group, onDrop]
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
      collect: monitor => ({
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    }),
    [column]
  );

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={styleNames(className, classes.dragElement, {
        [classes['drag-over-current']]: isOver || isOverCurrent,
        [classes.dragging]: isDragging,
      })}
      {...rest}
    />
  );
});

export default GridDragElementComponent;
