import { Draggable, Droppable } from "@hello-pangea/dnd";
import * as React from "react";

import { Box } from "../core";
import { findDataProp, makeTestId } from "../core/system/utils";
import { DefaultColumn } from "./kanban-default";
import KanbanRecord from "./kanban-record";
import { Column } from "./types";

export type RecordListProps = {
  column: Column;
  readonly?: boolean;
  style?: React.CSSProperties;
  className?: string;
};

export const RecordList = React.memo(function RecordList(
  props: RecordListProps,
) {
  const { column, readonly, style, className } = props;
  const { records } = column;
  const testId = findDataProp(props, "data-testid");
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
          role="list"
          aria-label={column.title}
          style={style}
          className={className}
          data-testid={testId}
        >
          {records?.map((record, index) => (
            <KanbanRecord
              record={record}
              column={column}
              key={record.id}
              index={index}
              readonly={readonly}
              data-testid={makeTestId(testId, "card", record.id)}
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

export function KanbanColumn(props: KanbanColumnProps) {
  const { column, index, readonly, className, style } = props;
  const {
    renderer: Component = DefaultColumn,
    id,
    disableDrag = true,
  } = column;
  const testId = findDataProp(props, "data-testid");

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
          data-testid={testId}
        >
          <Component
            RecordList={RecordList}
            column={column}
            readonly={readonly}
            data-testid={makeTestId(testId, "content")}
          />
        </Box>
      )}
    </Draggable>
  );
}

export default KanbanColumn;
