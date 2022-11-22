import React, { useCallback } from 'react';
import { Icon, useClassNames, useTheme } from '../core';

import { ReactComponent as BiCaretRightFill } from 'bootstrap-icons/icons/caret-right-fill.svg';
import { ReactComponent as BiCaretLeftFill } from 'bootstrap-icons/icons/caret-left-fill.svg';

import classes from './gantt.module.scss';
import * as TYPES from './types';

const Line = React.memo<{
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  pointer: boolean;
  source: number;
  target: number;
  sourceStart: TYPES.GanttEdgeType;
  targetEnd: TYPES.GanttEdgeType;
  onDeleteConnector?: (data: TYPES.ConnectProps) => void;
}>(function Line({
  x1,
  y1,
  x2,
  y2,
  pointer,
  source,
  target,
  targetEnd,
  sourceStart,
  onDeleteConnector,
}) {
  const left = x1 < x2 ? x1 : x2;
  const top = y1 < y2 ? y1 : y2;
  const width = x1 !== x2 ? Math.abs(x1 - x2) : 0;
  const height = y1 !== y2 ? Math.abs(y1 - y2) : 0;

  const { dir } = useTheme();
  const rtl = dir === 'rtl';

  const classNames = useClassNames();

  const handleDelete = useCallback(
    () =>
      onDeleteConnector &&
      onDeleteConnector({
        startId: source,
        finishId: target,
        source: sourceStart,
        target: targetEnd,
      }),
    [source, target, targetEnd, sourceStart, onDeleteConnector]
  );

  const isStartPointer = targetEnd === 'start';

  let pointerIcon;

  if (isStartPointer) {
    pointerIcon = rtl ? BiCaretLeftFill : BiCaretRightFill;
  } else {
    pointerIcon = rtl ? BiCaretRightFill : BiCaretLeftFill;
  }

  return (
    <>
      <div
        onDoubleClick={handleDelete}
        className={classes.ganttEdgeLine}
        style={{
          width: width <= 2 ? 0 : width,
          height: height <= 2 ? 0 : height,
          top,
          ...(rtl ? { right: left } : { left }),
        }}
      >
        {pointer && (
          <Icon
            as={pointerIcon}
            className={classNames(
              isStartPointer
                ? classes.ganttEdgeIconStart
                : classes.ganttEdgeIconEnd
            )}
          />
        )}
      </div>
    </>
  );
});

export type GanttEdgeProps = {
  edge: TYPES.GanttEdge;
  onDelete?: TYPES.GanttProps['onRecordDisconnect'];
};

export const GanttEdge = React.memo<GanttEdgeProps>(props => {
  const { edge, onDelete } = props;
  const {
    bendPoints,
    startPoint,
    endPoint,
    source,
    target,
    start: sourceStart,
    end: targetEnd,
  } = edge;
  const lines = React.useMemo(() => {
    const lines: {
      start: TYPES.GanttPoint;
      end: TYPES.GanttPoint;
      pointer: boolean;
    }[] = [];

    function addLine(point: TYPES.GanttPoint, pointer = false) {
      const $startPoint = lines.length
        ? lines[lines.length - 1].end
        : startPoint;
      $startPoint &&
        lines.push({
          start: $startPoint,
          end: point,
          pointer,
        });
    }

    bendPoints &&
      bendPoints.forEach((point: TYPES.GanttPoint) => addLine(point));

    endPoint && addLine(endPoint, true);

    return lines;
  }, [startPoint, endPoint, bendPoints]);

  return (
    <div className={classes.ganttEdgeLines}>
      {lines.map(({ start, end, pointer }, i) => (
        <Line
          key={i}
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          pointer={pointer}
          onDeleteConnector={onDelete}
          {...{ source, target, targetEnd, sourceStart }}
        />
      ))}
    </div>
  );
});
