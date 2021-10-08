import React, { useCallback } from 'react';
import { Box } from '@axelor-ui/core';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import KanbanColumn from './kanban-column';
import styles from './kanban.module.css';
import { CardEvent, Column, ColumnEvent } from './types';

export type KanbanProps = {
  columns?: Column[];
  readonly?: boolean;
  onCardMove?({ column, record, source, index }: CardEvent): void;
  onColumnMove?({ column, index }: ColumnEvent): void;
};

function Kanban({
  columns,
  onColumnMove,
  onCardMove,
  readonly,
  ...props
}: KanbanProps) {
  const getColumn = useCallback(
    columnId => columns?.find(c => String(c.id) === String(columnId)),
    [columns]
  );

  const handleDragEnd = useCallback(
    result => {
      const { source, destination, type } = result;
      if (!destination) {
        return;
      }

      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }

      if (type === 'column' && onColumnMove) {
        onColumnMove({
          column: columns![source.index],
          index: destination.index,
        });
        return;
      } else if (type === 'card' && onCardMove) {
        const sourceColumn = getColumn(source.droppableId)!;
        const destinationColumn = getColumn(destination.droppableId)!;
        const record = getColumn(source.droppableId)!.records![source.index];

        onCardMove({
          column: destinationColumn,
          source: sourceColumn,
          record,
          index: destination.index,
        });
      }
    },
    [columns, onCardMove, onColumnMove, getColumn]
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable
        droppableId="kanban"
        type="column"
        direction="horizontal"
        isDropDisabled={readonly}
      >
        {({ innerRef, droppableProps, placeholder }) => (
          <Box ref={innerRef} {...droppableProps} className={styles.board}>
            {columns?.map((column, index) => (
              <KanbanColumn
                column={column}
                key={column.id}
                index={index}
                readonly={readonly}
                {...props}
              />
            ))}
            {placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Kanban;
