/**
 * @title Row Reorder
 */
import React, { useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

import { Box, clsx } from "../core";
import { MaterialIcon } from "../icons/material-icon";

import * as TYPES from "./types";

import styles from "./grid.module.scss";

const GridDNDRowContext = React.createContext<any>(null);

export interface GridDNDBodyProps extends Pick<TYPES.GridState, "rows"> {
  children: React.ReactNode;
  style?: any;
  className?: string;
  onRowMove?: TYPES.GridRowProps["onMove"];
  onRowMoveStart?: TYPES.GridRowProps["onMoveStart"];
}

function getStyle(style: any) {
  const { transform } = style;
  if (transform) {
    const [, X] = transform
      .slice("translate(".length, transform.length - 1)
      .split(",")
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
  const { className, style, children, rows, onRowMove, onRowMoveStart } = props;

  function handleDragEnd(result: any) {
    const { source, destination } = result;
    // serve as row move end
    onRowMoveStart && onRowMoveStart(null);

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
    <DragDropContext onDragStart={onRowMoveStart} onDragEnd={handleDragEnd}>
      <Droppable
        droppableId={"GRID_ROWS"}
        type={"GRID_ROW"}
        direction="vertical"
      >
        {(provided) => (
          <div
            className={className}
            style={style}
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
      {(provided, snapshot) => (
        <GridDNDRowContext.Provider value={provided.dragHandleProps}>
          <div
            {...provided.draggableProps}
            ref={(ref) => provided.innerRef(ref)}
            style={getStyle(provided.draggableProps.style)}
            children={children}
            className={clsx(styles.dndRow, className)}
            data-dragging={snapshot.isDragging ? "true" : undefined}
          />
          <Box as="span" d="none" {...provided.dragHandleProps} />
          {snapshot.isDragging && <DisableScrolling />}
        </GridDNDRowContext.Provider>
      )}
    </Draggable>
  );
}

function DisableScrolling() {
  useEffect(() => {
    const cb = (e: WheelEvent) => e.preventDefault();

    window.addEventListener("wheel", cb, { passive: false });
    return () => {
      window.removeEventListener("wheel", cb);
    };
  }, []);
  return null;
}

export function GridDNDColumn({
  className,
  style,
  onClick,
}: React.HTMLAttributes<HTMLDivElement>) {
  const props = React.useContext(GridDNDRowContext);
  return (
    <Box
      d="flex"
      className={className}
      onClick={onClick}
      style={{ ...props?.style, ...style }}
      {...props}
      tabIndex={-1}
    >
      <MaterialIcon icon="drag_handle" />
    </Box>
  );
}
