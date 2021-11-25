import React from 'react';
import moment from 'moment';
import { DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Icon } from '@axelor-ui/core';
import { styleNames } from '@axelor-ui/core/styles';

import { CONFIG, getDateFromOffset } from './utils';
import * as TYPES from './types';
import classes from './gantt.module.css';

function disablePreview(preview: (e: any, options: any) => void) {
  preview(getEmptyImage(), { captureDraggingState: true });
}

const { DND_TYPES } = CONFIG;

function VirtualLine({
  type,
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  type: TYPES.GanttEdgeType;
}) {
  const distance = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  const xMid = (x1 + x2) / 2;
  const yMid = (y1 + y2) / 2;
  const degree = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  const leftSpace = type === 'start' ? 0 : 10;

  return (
    <div
      style={{
        width: distance,
        top: yMid + 10,
        left: xMid - distance / 2 + leftSpace,
        transform: `rotate(${degree}deg)`,
      }}
      className={classes.virtualLine}
    >
      <Icon use="caret-down-fill" className={classes.virtualLineIcon} />
    </div>
  );
}

export const GanttLine = React.memo(function GanttLine(props: {
  hourSize: number;
  cellSize: number;
  index: number;
  startDate: moment.Moment;
  endDate: moment.Moment;
  view: TYPES.GanttType;
  data: TYPES.GanttRecord;
  onUpdate?: TYPES.GanttProps['onRecordUpdate'];
  onConnect?: TYPES.GanttProps['onRecordConnect'];
}) {
  const dragLineRef = React.useRef<HTMLDivElement>(null);
  const leftConnectRef = React.useRef<HTMLDivElement>(null);
  const rightConnectRef = React.useRef<HTMLDivElement>(null);
  const progressElement = React.useRef<HTMLDivElement>(null);
  const progressLabelElement = React.useRef<HTMLDivElement>(null);
  const refs = React.useRef<{ element: any; progress: string | null }>({
    progress: null,
    element: null,
  });
  const [virtualLine, setVirtualLine] = React.useState<{
    source?: TYPES.GanttVirtualLinePoint;
    target?: TYPES.GanttVirtualLinePoint;
  } | null>(null);

  const {
    startDate,
    index,
    hourSize,
    cellSize,
    view,
    data,
    onUpdate,
    onConnect,
  } = props;
  const { id, duration } = data;

  const { x, y, width } = (() => {
    const diffHours = moment
      .duration(moment(data.startDate).diff(startDate))
      .asHours();

    const width = Number((Number(duration) * hourSize).toFixed(0));
    const y =
      CONFIG.CELL_HEIGHT * index +
      (CONFIG.CELL_HEIGHT - CONFIG.LINE_HEIGHT) / 2;
    const x = Number((diffHours * hourSize).toFixed(0));
    return { x, y, width };
  })();

  const setVirtualLineSource = (source: TYPES.GanttVirtualLinePoint) =>
    setVirtualLine({ source });
  const setVirtualLineTarget = (target: TYPES.GanttVirtualLinePoint) =>
    setVirtualLine(line => ({ ...line, target }));

  const getDragProps = (type: string, options?: any) => ({
    type,
    item: {
      id,
      type,
      refs,
      lineRef: dragLineRef,
    },
    ...options,
  });

  const [, drag, linePreview] = useDrag(
    getDragProps(DND_TYPES.LINE, {
      end: (item: TYPES.GanttDragItem, monitor: DragSourceMonitor) => {
        const line = refs.current.element;
        const date = getDateFromOffset(line.x, startDate, view, cellSize);
        onUpdate &&
          onUpdate(data, {
            startDate: date,
          });
      },
    })
  );

  const [, leftResizeDrag, leftResizePreview] = useDrag(
    getDragProps(DND_TYPES.RESIZE_LEFT, {
      end: (item: TYPES.GanttDragItem, monitor: DragSourceMonitor) => {
        const line = refs.current.element;
        const date = getDateFromOffset(line.x, startDate, view, cellSize);
        const duration = (line.width / hourSize).toFixed(2);
        onUpdate &&
          onUpdate(data, {
            startDate: date,
            duration,
          });
      },
    })
  );

  const [, rightResizeDrag, rightResizePreview] = useDrag(
    getDragProps(DND_TYPES.RESIZE_RIGHT, {
      end: (item: TYPES.GanttDragItem, monitor: DragSourceMonitor) => {
        const line = refs.current.element;
        const duration = (line.width / hourSize).toFixed(2);
        onUpdate &&
          onUpdate(data, {
            duration,
          });
      },
    })
  );

  const [, progressDrag, progressPreview] = useDrag(
    getDragProps(DND_TYPES.PROGRESS, {
      end: (item: TYPES.GanttDragItem, monitor: DragSourceMonitor) => {
        const { progress } = refs.current;
        if (progress !== null) {
          onUpdate && onUpdate(data, { progress });
        }
        refs.current.progress = null;
      },
    })
  );

  const [, leftConnectDrag, leftConnectPreview] = useDrag({
    type: DND_TYPES.CONNECT_START,
    item: (monitor: DragSourceMonitor) => {
      const clientOffset = monitor.getSourceClientOffset();
      if (
        clientOffset &&
        dragLineRef.current &&
        dragLineRef.current.parentElement
      ) {
        const parentBound =
          dragLineRef.current.parentElement.getBoundingClientRect();
        const source: TYPES.GanttVirtualLinePoint = {
          x: clientOffset.x - parentBound.left + 20,
          y: clientOffset.y - parentBound.top + 5,
          type: 'start',
        };
        setVirtualLineSource(source);
      }
      return {
        ...getDragProps(DND_TYPES.CONNECT_START).item,
        setVirtualLineTarget,
      };
    },
    end: () => {
      setVirtualLine(null);
    },
  });

  const [, rightConnectDrag, rightConnectPreview] = useDrag({
    type: DND_TYPES.CONNECT_END,
    item: (monitor: DragSourceMonitor) => {
      const clientOffset = monitor.getSourceClientOffset();
      if (
        clientOffset &&
        dragLineRef.current &&
        dragLineRef.current.parentElement
      ) {
        const parentBound =
          dragLineRef.current.parentElement.getBoundingClientRect();
        const source: TYPES.GanttVirtualLinePoint = {
          x: clientOffset.x - parentBound.left - 15,
          y: clientOffset.y - parentBound.top + 5,
          type: 'finish',
        };
        setVirtualLineSource(source);
      }
      return {
        ...getDragProps(DND_TYPES.CONNECT_END).item,
        setVirtualLineTarget,
      };
    },
    end: () => {
      setVirtualLine(null);
    },
  });

  const [dropProps, drop] = useDrop({
    accept: [DND_TYPES.CONNECT_START, DND_TYPES.CONNECT_END],
    drop: (item, monitor) => {
      const dragItem: TYPES.GanttDragItem = monitor.getItem();
      const coords: TYPES.ConnectProps = {
        startId: dragItem.id,
        finishId: id,
        source: dragItem.type === 'CONNECT_START' ? 'start' : 'finish',
        target: 'start',
      };
      onConnect && onConnect(coords);
    },
    canDrop: (item, monitor) => {
      const dragItem: TYPES.GanttDragItem = monitor.getItem();
      return dragItem.id !== data.id;
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const [leftConnectProps, leftConnectDrop] = useDrop({
    accept: [DND_TYPES.CONNECT_START, DND_TYPES.CONNECT_END],
    drop: (item, monitor) => {
      const dragItem: TYPES.GanttDragItem = monitor.getItem();
      const coords: TYPES.ConnectProps = {
        startId: dragItem.id,
        finishId: id,
        source: dragItem.type === 'CONNECT_START' ? 'start' : 'finish',
        target: 'start',
      };
      onConnect && onConnect(coords);
    },
    canDrop: (item, monitor) => {
      const dragItem: TYPES.GanttDragItem = monitor.getItem();
      return dragItem.id !== data.id;
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const [rightConnectProps, rightConnectDrop] = useDrop({
    accept: [DND_TYPES.CONNECT_START, DND_TYPES.CONNECT_END],
    drop: (item, monitor) => {
      const dragItem: TYPES.GanttDragItem = monitor.getItem();
      const coords: TYPES.ConnectProps = {
        startId: dragItem.id,
        finishId: id,
        source: dragItem.type === 'CONNECT_START' ? 'start' : 'finish',
        target: 'finish',
      };
      onConnect && onConnect(coords);
    },
    canDrop: (item, monitor) => {
      const dragItem: TYPES.GanttDragItem = monitor.getItem();
      return dragItem.id !== data.id;
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const progress = Number(data.progress || 0);
  const progressHours = Number(progress * Number(duration || 0)) / 100;
  const progressWidth = progressHours * hourSize;

  React.useEffect(() => {
    disablePreview(progressPreview);
    disablePreview(leftResizePreview);
    disablePreview(rightResizePreview);
    disablePreview(linePreview);
    disablePreview(leftConnectPreview);
    disablePreview(rightConnectPreview);
  }, [
    progressPreview,
    leftResizePreview,
    rightResizePreview,
    linePreview,
    leftConnectPreview,
    rightConnectPreview,
  ]);

  drop(drag(dragLineRef));
  leftConnectDrop(leftConnectDrag(leftConnectRef));
  rightConnectDrop(rightConnectDrag(rightConnectRef));

  React.useEffect(() => {
    refs.current.element = { x, y, width };
  }, [x, y, width]);

  return (
    <>
      <div
        ref={dragLineRef}
        className={styleNames(classes.ganttLine, {
          [classes.connect]: dropProps.isOver,
        })}
        style={{
          top: y,
          left: x,
          position: 'absolute',
          width,
          height: CONFIG.LINE_HEIGHT,
        }}
      >
        <div
          ref={leftConnectRef}
          className={styleNames(classes.ganttConnector, classes.left, {
            [classes.show]:
              leftConnectProps.isOver ||
              dropProps.isOver ||
              (virtualLine && virtualLine.source?.type === 'start'),
            [classes.connect]: leftConnectProps.isOver,
          })}
        >
          <div className={classes.ganttConnectorLink} />
        </div>
        <div
          ref={leftResizeDrag}
          className={styleNames(classes.ganttLineDrag, classes.left)}
        />
        <div className={styleNames(classes.ganttLineDragArea, classes.left)} />

        <div
          ref={rightConnectRef}
          className={styleNames(classes.ganttConnector, classes.right, {
            [classes.show]:
              rightConnectProps.isOver ||
              dropProps.isOver ||
              (virtualLine && virtualLine.source?.type === 'finish'),
            [classes.connect]: rightConnectProps.isOver,
          })}
        >
          <div className={classes.ganttConnectorLink} />
        </div>
        <div
          ref={rightResizeDrag}
          className={styleNames(classes.ganttLineDrag, classes.right)}
        />
        <div className={styleNames(classes.ganttLineDragArea, classes.right)} />
        <div
          ref={progressElement}
          className={classes.ganttLineProgress}
          style={{
            height: CONFIG.LINE_HEIGHT,
            width: `${progress}%`,
          }}
        >
          <div className={classes.ganttLineProgressIcon} />
        </div>

        <div
          ref={progressDrag}
          className={classes.ganttLineProgressIndicator}
          style={{
            left: Math.max(0, progressWidth - (progressWidth > 5 ? 5 : 0)),
          }}
        ></div>
        <span>{data.name}</span>
        <div
          ref={progressLabelElement}
          style={{
            left: -(`${data.progress}`.length * 10),
            top: -2,
          }}
          className={classes.ganttLineProgressLabel}
        >
          {progress > 0 && `${Math.round(progress)}%`}
        </div>
      </div>

      {virtualLine && virtualLine.source && virtualLine.target && (
        <VirtualLine
          type={virtualLine.source.type}
          x1={virtualLine.source.x}
          y1={virtualLine.source.y}
          x2={virtualLine.target.x}
          y2={virtualLine.target.y}
        />
      )}
    </>
  );
});
