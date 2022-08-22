import { Divider } from '@axelor-ui/core';
import React from 'react';
import { useDrag } from 'react-dnd';

export function GridColumResizer(props: React.HTMLAttributes<HTMLSpanElement>) {
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: 'COLUMN_RESIZER',
      item: {},
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    []
  );
  return (
    <span
      ref={drag}
      {...props}
      style={{ ...props.style, visibility: isDragging ? 'hidden' : 'visible' }}
    >
      {preview && <span ref={preview} />}
      <Divider vertical />
    </span>
  );
}
