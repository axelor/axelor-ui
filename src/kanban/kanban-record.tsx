import { Box } from '../core';
import { Draggable } from 'react-beautiful-dnd';

import { Column, Record } from './types';
import { DefaultRecord } from './kanban-default';

export type KanbanRecordProps = {
  record: Record;
  column: Column;
  index: number;
  readonly?: boolean;
};

export function KanbanRecord({
  record,
  column,
  index,
  readonly,
}: KanbanRecordProps) {
  const { renderer: Component = DefaultRecord } = record;

  return (
    <Draggable
      index={index}
      draggableId={String(record.id)}
      isDragDisabled={readonly || column.readonly}
    >
      {({ innerRef, draggableProps, dragHandleProps }, { isDragging }) => (
        <Box ref={innerRef} {...draggableProps} {...dragHandleProps}>
          <Component record={record} column={column} isDragging={isDragging} />
        </Box>
      )}
    </Draggable>
  );
}

export default KanbanRecord;
