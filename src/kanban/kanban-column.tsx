import * as React from 'react';
import { Box } from '../core';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import KanbanRecord from './kanban-record';
import { DefaultColumn } from './kanban-default';
import { Column } from './types';

export type RecordListProps = {
  column: Column;
  readonly?: boolean;
  style?: React.CSSProperties;
  className?: string;
};

export const RecordList = React.memo(function RecordList({
  column,
  readonly,
  style,
  className,
}: RecordListProps) {
  const { records } = column;
  return (
    <Droppable
      droppableId={String(column.id)}
      type="card"
      isDropDisabled={readonly || column.readonly}
    >
      {({ innerRef, droppableProps, placeholder }) => (
        <Box
          ref={innerRef}
          {...droppableProps}
          d="flex"
          flexDirection="column"
          style={style}
          className={className}
        >
          {records?.map((record, index) => (
            <KanbanRecord
              record={record}
              column={column}
              key={record.id}
              index={index}
              readonly={readonly}
            />
          ))}
          {placeholder}
        </Box>
      )}
    </Droppable>
  );
});

export type KanbanColumnProps = {
  column: Column;
  index: number;
  readonly?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export function KanbanColumn({
  column,
  index,
  readonly,
  className,
  style,
}: KanbanColumnProps) {
  const {
    renderer: Component = DefaultColumn,
    id,
    disableDrag = true,
  } = column;

  return (
    <Draggable
      draggableId={String(id)}
      index={index}
      isDragDisabled={readonly || column.readonly || disableDrag}
    >
      {({ innerRef, draggableProps, dragHandleProps }) => (
        <Box
          ref={innerRef}
          {...draggableProps}
          {...dragHandleProps}
          className={className}
          style={{ ...style, ...draggableProps.style }}
        >
          <Component
            RecordList={RecordList}
            column={column}
            readonly={readonly}
          />
        </Box>
      )}
    </Draggable>
  );
}

export default KanbanColumn;
