import React from 'react';
import { DragSource } from 'react-dnd';

const GridColumResizerComponent = React.memo(function GridColumResizer({
  connectDragSource,
  connectDragPreview,
  isDragging,
  ...rest
}: any) {
  return connectDragSource(
    <span {...rest} style={{ visibility: isDragging ? 'hidden' : 'visible' }}>
      {connectDragPreview && connectDragPreview(<span />)}
    </span>
  );
});

const cardSource = {
  beginDrag() {
    return {};
  },
};

function sourceCollect(connect: any, monitor: any) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  };
}

export const GridColumResizer = DragSource(
  'COLUMN_RESIZER',
  cardSource,
  sourceCollect
)(GridColumResizerComponent);

GridColumResizer.dragSource = cardSource;
GridColumResizer.dragCollect = sourceCollect;
