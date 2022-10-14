import { useCallback } from 'react';
import { Box, useClassNames } from '@axelor-ui/core';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

import styles from './kanban.module.css';
import KanbanColumn, { KanbanColumnProps } from './kanban-column';
import { CardEvent, Column, ColumnEvent } from './types';

export type KanbanProps = {
  columns?: Column[];
  className?: string;
  readonly?: boolean;
  onCardMove?({ column, record, source, index }: CardEvent): void;
  onColumnMove?({ column, index }: ColumnEvent): void;
  ColumnProps?: Pick<KanbanColumnProps, 'className' | 'style'>;
};

function Kanban({
  columns,
  onColumnMove,
  onCardMove,
  readonly,
  className,
  ColumnProps,
}: KanbanProps) {
  const getColumn = useCallback(
    (columnId: string) => columns?.find(c => String(c.id) === String(columnId)),
    [columns]
  );

  const handleDragEnd = useCallback(
    (result: DropResult) => {
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
  const classNames = useClassNames();
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable
        droppableId="kanban"
        type="column"
        direction="horizontal"
        isDropDisabled={readonly}
      >
        {({ innerRef, droppableProps, placeholder }) => (
          <Box
            ref={innerRef}
            {...droppableProps}
            className={classNames(styles.board, className)}
          >
            {columns?.map((column, index) => (
              <KanbanColumn
                column={column}
                key={column.id}
                index={index}
                readonly={readonly}
                {...ColumnProps}
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
