import React from "react";
import { useDrag } from "react-dnd";
import { Divider } from "../core";

export function GridColumResizer(props: React.HTMLAttributes<HTMLSpanElement>) {
  const [, drag, preview] = useDrag(
    () => ({
      type: "COLUMN_RESIZER",
      item: {},
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [],
  );
  return (
    <span
      ref={(node) => {
        drag(node);
      }}
      {...props}
    >
      {preview && (
        <span
          ref={(node) => {
            preview(node);
          }}
        />
      )}
      <Divider vertical />
    </span>
  );
}
