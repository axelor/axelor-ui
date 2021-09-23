import React from 'react';
import { DragSource, DropTarget } from 'react-dnd';
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

const GridDragElementComponent = React.memo(function GridDragElementComponent(
  props: any
) {
  const {
    className = '',
    style = {},
    isOver,
    isOverCurrent,
    isDragging,
    connectDragSource,
    connectDropTarget,
    children,
  } = props;
  return connectDragSource(
    connectDropTarget(
      <div
        className={styleNames(className, {
          [classes['drag-over-current']]: isOver || isOverCurrent,
        })}
        style={{
          opacity: isDragging ? 0.8 : 1,
          ...style,
        }}
      >
        {children}
      </div>
    )
  );
});

const cardSource = {
  canDrag({ canDrag = true }: { canDrag: boolean }) {
    return canDrag;
  },
  beginDrag(props: any) {
    const item = { ...props.column, ...props.group };
    return item;
  },
  endDrag(props: any, monitor: any) {
    if (!monitor.didDrop()) {
      return;
    }
    const dropResult = monitor.getDropResult();
    if (dropResult) {
      props.onDrop && props.onDrop(props, dropResult.props);
    }
  },
};

const cardTarget = {
  canDrop(props: any, monitor: any) {
    const item = monitor.getItem();
    return item.name !== (props.column || {}).name;
  },
  drop(props: any, monitor: any) {
    if (monitor.didDrop()) {
      return;
    }
    return { moved: true, props };
  },
};

function sourceCollect(connect: any, monitor: any) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

function targetCollect(connect: any, monitor: any) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
  };
}

export default DragSource(
  DND_TYPES.ELEMENT,
  cardSource,
  sourceCollect
)(
  DropTarget(
    DND_TYPES.ELEMENT,
    cardTarget,
    targetCollect
  )(GridDragElementComponent)
);
