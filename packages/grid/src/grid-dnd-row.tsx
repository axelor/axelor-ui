/**
 * @title Row Reorder
 */
import React from 'react';
import { ConnectDragSource, DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { Icon } from '@axelor-ui/core';
import { XYCoord } from 'dnd-core';
import { ReactComponent as BiList } from 'bootstrap-icons/icons/list.svg';

import { GridRowProps, GridRow } from './types';

const ItemTypes = {
  CARD: 'grid_row',
};

const GridDNDRowContext = React.createContext<ConnectDragSource | null>(null);

let currentMove: any[] | null = null;

export function GridDNDRow(props: GridRowProps) {
  const { index, className, children, data, onMove } = props;
  const ref = React.useRef<HTMLDivElement>(null);
  const [isStartRow, setStartRow] = React.useState(false);

  const [{ hovered }, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      drop: (item: GridRow) => item,
      hover(item: GridRow, monitor) {
        if (!ref.current) {
          return;
        }
        const dragItem = item;
        const hoverItem = data;
        if (dragItem?.key === hoverItem?.key) {
          return;
        }

        // Determine rectangle on screen
        const hoverBoundingRect = ref.current.getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY =
          (clientOffset as XYCoord).y - hoverBoundingRect.top;

        if (index === 0) {
          setStartRow(hoverClientY < hoverMiddleY);
        }

        currentMove = [
          item,
          data,
          // Dragging upwards
          index === 0 && hoverClientY < hoverMiddleY,
        ];
      },
      canDrop(item, monitor) {
        const dropItem: GridRow = monitor.getItem();
        return data.key !== dropItem.key;
      },
      collect: monitor => ({
        highlighted: monitor.canDrop(),
        hovered: monitor.isOver(),
      }),
    }),
    [index, data]
  );

  const [, drag, preview] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      item: data,
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item: GridRow, monitor: DragSourceMonitor) => {
        if (monitor.didDrop() && currentMove) {
          onMove && onMove(currentMove[0], currentMove[1], currentMove[2]);
        }
      },
    }),
    [data]
  );

  drop(preview(ref));

  return (
    <GridDNDRowContext.Provider value={drag}>
      <div
        ref={ref}
        {...{ className, children }}
        style={{
          [isStartRow ? 'borderTop' : 'borderBottom']: hovered
            ? '2px solid #000'
            : 'none',
        }}
      />
    </GridDNDRowContext.Provider>
  );
}

export function GridDNDColumn({
  className,
  style,
  onClick,
}: React.HTMLAttributes<HTMLDivElement>) {
  const dragRef = React.useContext(GridDNDRowContext);
  return (
    <div
      ref={dragRef}
      style={{ cursor: 'move', ...style }}
      {...{ className, onClick }}
    >
      <Icon as={BiList} />
    </div>
  );
}
