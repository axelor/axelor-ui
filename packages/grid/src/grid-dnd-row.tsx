/**
 * @title Row Reorder
 */
import React from 'react';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';
import { Box, Icon } from '@axelor-ui/core';
import { ReactComponent as BiList } from 'bootstrap-icons/icons/list.svg';
import * as TYPES from './types';

const GridDNDRowContext = React.createContext<any>(null);

export interface GridDNDBodyProps extends Pick<TYPES.GridState, 'rows'> {
  children: React.ReactNode;
  className?: string;
  onRowMove?: TYPES.GridRowProps['onMove'];
}

function getStyle(style: any) {
  const { transform } = style;
  if (transform) {
    const [, X] = transform
      .slice('translate('.length, transform.length - 1)
      .split(',')
      .map((x: string) => x.trim());
    const axisLockX = `translate(0px, ${X})`;
    return {
      ...style,
      transform: axisLockX,
    };
  }
  return style;
}

export function GridDNDContainer(props: GridDNDBodyProps) {
  const { className, children, rows, onRowMove } = props;

  function handleDragEnd(result: any) {
    const { source, destination } = result;
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    if (result.destination.index === result.source.index) {
      return;
    }
    const dragIndex = source.index;
    const hoverIndex = destination.index;

    onRowMove && onRowMove(rows[dragIndex], rows[hoverIndex]);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable
        droppableId={'GRID_ROWS'}
        type={'GRID_ROW'}
        direction="vertical"
      >
        {provided => (
          <div
            className={className}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {children as any}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export function GridDNDRow(props: TYPES.GridRowProps) {
  const { index, className, children, data } = props;
  return (
    <Draggable draggableId={`${data.key}`} index={index}>
      {provided => (
        <GridDNDRowContext.Provider value={provided.dragHandleProps}>
          <div
            {...provided.draggableProps}
            ref={ref => provided.innerRef(ref)}
            style={getStyle(provided.draggableProps.style)}
            {...{ className, children }}
          />
          <Box as="span" d="none" {...provided.dragHandleProps} />
        </GridDNDRowContext.Provider>
      )}
    </Draggable>
  );
}

export function GridDNDColumn({
  className,
  style,
  onClick,
}: React.HTMLAttributes<HTMLDivElement>) {
  const props = React.useContext(GridDNDRowContext);
  return (
    <div
      {...props}
      style={{ ...props?.style, cursor: 'move', ...style }}
      {...{ className, onClick }}
    >
      <Icon as={BiList} />
    </div>
  );
}
