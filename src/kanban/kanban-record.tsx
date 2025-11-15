import { Box } from "../core";
import { findDataProp, makeTestId } from "../core/system/utils";
import { Draggable } from "@hello-pangea/dnd";

import { Column, Record } from "./types";
import { DefaultRecord } from "./kanban-default";

export type KanbanRecordProps = {
  record: Record;
  column: Column;
  index: number;
  readonly?: boolean;
};

export function KanbanRecord(props: KanbanRecordProps) {
  const { record, column, index, readonly } = props;
  const { renderer: Component = DefaultRecord } = record;
  const testId = findDataProp(props, "data-testid");

  return (
    <Draggable
      index={index}
      draggableId={String(record.id)}
      isDragDisabled={readonly || column.readonly}
    >
      {({ innerRef, draggableProps, dragHandleProps }, { isDragging }) => (
        <Box
          ref={innerRef}
          {...draggableProps}
          {...dragHandleProps}
          role="listitem"
          aria-label={record.title}
          data-testid={testId}
        >
          <Component
            record={record}
            column={column}
            isDragging={isDragging}
            data-testid={makeTestId(testId, "content")}
          />
        </Box>
      )}
    </Draggable>
  );
}

export default KanbanRecord;
