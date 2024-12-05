import moment, { Dayjs } from "dayjs";
import React, { useCallback } from "react";
import { DragSourceMonitor, useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

import { useClassNames, useTheme } from "../core";
import { BootstrapIcon } from "../icons/bootstrap-icon";

import * as TYPES from "./types";
import { CONFIG, getCellHeight, getDateFromOffset, getLineHeight } from "./utils";
import classes from "./gantt.module.scss";

function disablePreview(preview: (e: any, options: any) => void) {
  preview(getEmptyImage(), { captureDraggingState: true });
}

const { DND_TYPES } = CONFIG;

function getRGBA(hex: string, opacity: number = 1): string {
  const r = hex.slice(1, 3);
  const g = hex.slice(3, 5);
  const b = hex.slice(5, 7);
  return `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(
    b,
    16,
  )}, ${opacity})`;
}

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
  const leftSpace = type === "start" ? 0 : 10;

  const left = xMid - distance / 2 + leftSpace;
  return (
    <div
      style={{
        width: distance,
        top: yMid + 10,
        transform: `rotate(${degree}deg)`,
        left,
      }}
      className={classes.virtualLine}
    >
      <BootstrapIcon
        icon={"caret-down-fill"}
        className={classes.virtualLineIcon}
      />
    </div>
  );
}

export const GanttLine = React.memo(function GanttLine(props: {
  hourSize: number;
  cellSize: number;
  index: number;
  startDate: Dayjs;
  endDate: Dayjs;
  view: TYPES.GanttType;
  data: TYPES.GanttRecord;
  config?: TYPES.GanttProps["config"];
  onUpdate?: TYPES.GanttProps["onRecordUpdate"];
  onConnect?: TYPES.GanttProps["onRecordConnect"];
}) {
  const dragLineRef = React.useRef<HTMLDivElement>(null);
  const leftConnectRef = React.useRef<HTMLDivElement>(null);
  const rightConnectRef = React.useRef<HTMLDivElement>(null);
  const progressElement = React.useRef<HTMLDivElement>(null);
  const refs = React.useRef<{ element: any; progress: string | null }>({
    progress: null,
    element: null,
  });
  const [virtualLine, setVirtualLine] = React.useState<{
    source?: TYPES.GanttVirtualLinePoint;
    target?: TYPES.GanttVirtualLinePoint;
  } | null>(null);

  const { dir } = useTheme();
  const rtl = dir === "rtl";

  const {
    startDate,
    index,
    hourSize,
    cellSize,
    view,
    config,
    data,
    onUpdate,
    onConnect,
  } = props;
  const { id, duration, $color } = data;
  const {
    progress: allowProgress = true,
    duration: allowDuration = true,
    startDate: allowStartDate = true,
    endDate: allowEndDate = true,
  } = config || {};

  const { x, y, width } = (() => {
    const diffHours = moment
      .duration(moment(data.startDate).diff(startDate))
      .asHours();
    const cellHeight = getCellHeight();
    const width = Number((Number(duration) * hourSize).toFixed(0));
    const y = cellHeight * index + (cellHeight - getLineHeight()) / 2;
    const x = Number((diffHours * hourSize).toFixed(0));
    return { x, y, width };
  })();

  const setVirtualLineSource = (source: TYPES.GanttVirtualLinePoint) =>
    setVirtualLine({ source });
  const setVirtualLineTarget = (target: TYPES.GanttVirtualLinePoint) =>
    setVirtualLine((line) => ({ ...line, target }));

  const getLineData = useCallback(() => {
    const line = refs.current.element;
    return {
      duration: (line.width / hourSize).toFixed(2),
      startDate: getDateFromOffset(line.x, startDate, view, cellSize),
      endDate: getDateFromOffset(
        line.x + line.width,
        startDate,
        view,
        cellSize,
      ),
    };
  }, [cellSize, hourSize, startDate, view]);

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
      end: () => {
        const line = getLineData();
        if (allowStartDate || allowEndDate) {
          onUpdate?.(data, {
            ...(allowStartDate && { startDate: line.startDate }),
            ...(allowEndDate && { endDate: line.endDate }),
          });
        }
      },
    }),
  );

  const [, leftResizeDrag, leftResizePreview] = useDrag(
    getDragProps(DND_TYPES.RESIZE_LEFT, {
      end: () => {
        const line = getLineData();
        if (allowStartDate || allowDuration) {
          onUpdate?.(data, {
            ...(allowStartDate && { startDate: line.startDate }),
            ...(allowDuration && { duration: line.duration }),
          });
        }
      },
    }),
  );

  const [, rightResizeDrag, rightResizePreview] = useDrag(
    getDragProps(DND_TYPES.RESIZE_RIGHT, {
      end: () => {
        const line = getLineData();
        if (allowDuration || allowEndDate) {
          onUpdate?.(data, {
            ...(allowDuration && { duration: line.duration }),
            ...(allowEndDate && { endDate: line.endDate }),
          });
        }
      },
    }),
  );

  const [, progressDrag, progressPreview] = useDrag(
    getDragProps(DND_TYPES.PROGRESS, {
      end: () => {
        const { progress } = refs.current;
        if (allowProgress && progress !== null) {
          onUpdate?.(data, { progress });
        }
        refs.current.progress = null;
      },
    }),
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
          x: clientOffset.x - parentBound.left + 10,
          y: clientOffset.y - parentBound.top - 5,
          type: "start",
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
          x: clientOffset.x - parentBound.left - 5,
          y: clientOffset.y - parentBound.top - 5,
          type: "finish",
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
        source: dragItem.type === "CONNECT_START" ? "start" : "finish",
        target: "start",
      };
      !dragItem.connect && onConnect && onConnect(coords);
    },
    canDrop: (item, monitor) => {
      const dragItem: TYPES.GanttDragItem = monitor.getItem();
      return dragItem.id !== data.id;
    },
    collect: (monitor) => ({
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
        source: dragItem.type === "CONNECT_START" ? "start" : "finish",
        target: "start",
      };
      dragItem.connect = true;
      onConnect && onConnect(coords);
    },
    canDrop: (item, monitor) => {
      const dragItem: TYPES.GanttDragItem = monitor.getItem();
      return dragItem.id !== data.id;
    },
    collect: (monitor) => ({
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
        source: dragItem.type === "CONNECT_START" ? "start" : "finish",
        target: "finish",
      };
      dragItem.connect = true;
      onConnect && onConnect(coords);
    },
    canDrop: (item, monitor) => {
      const dragItem: TYPES.GanttDragItem = monitor.getItem();
      return dragItem.id !== data.id;
    },
    collect: (monitor) => ({
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

  React.useEffect(() => {
    const dragLine = dragLineRef.current;
    if (dragLine) {
      dragLine.style[rtl ? "right" : "left"] = `${x}px`;
      dragLine.style.top = `${y}px`;
    }
  }, [x, y, data, rtl]);

  const classNames = useClassNames();

  return (
    <>
      <div
        ref={dragLineRef}
        className={classNames(classes.ganttLine, {
          [classes.connect]: dropProps.isOver,
        })}
        style={{
          top: y,
          position: "absolute",
          width,
          height: getLineHeight(),
          ...(rtl ? { right: x } : { left: x }),
          ...($color
            ? {
                "--gantt-line-bg": getRGBA($color, 0.75),
                "--gantt-progress-color": getRGBA($color, 1),
              }
            : {}),
        }}
      >
        {allowProgress && (
          <div
            ref={progressElement}
            className={classes.ganttLineProgress}
            style={{
              height: getLineHeight(),
              width: `${progress}%`,
            }}
          >
            <div
              className={classes.ganttLineProgressContent}
              style={{
                ...(rtl ? { right: `${progress}%` } : { left: `${progress}%` }),
              }}
            >
              <div className={classes.ganttLineProgressLabel}>
                {`${progress > 0 ? Math.round(progress) : "0"}%`}
              </div>
            </div>
          </div>
        )}
        <div
          ref={leftConnectRef}
          className={classNames(classes.ganttConnector, {
            [classes.left]: !rtl,
            [classes.right]: rtl,
            [classes.show]:
              leftConnectProps.isOver ||
              dropProps.isOver ||
              (virtualLine && virtualLine.source?.type === "start"),
            [classes.connect]: leftConnectProps.isOver,
          })}
        >
          <div className={classes.ganttConnectorLink} />
        </div>

        <div
          className={classNames(classes.ganttLineDragArea, {
            [classes.left]: !rtl,
            [classes.right]: rtl,
          })}
        />

        <div
          ref={leftResizeDrag}
          className={classNames(classes.ganttLineDrag, {
            [classes.left]: !rtl,
            [classes.right]: rtl,
          })}
        />

        <div
          ref={rightConnectRef}
          className={classNames(classes.ganttConnector, {
            [classes.left]: rtl,
            [classes.right]: !rtl,
            [classes.show]:
              rightConnectProps.isOver ||
              dropProps.isOver ||
              (virtualLine && virtualLine.source?.type === "finish"),
            [classes.connect]: rightConnectProps.isOver,
          })}
        >
          <div className={classes.ganttConnectorLink} />
        </div>

        <div
          className={classNames(classes.ganttLineDragArea, {
            [classes.left]: rtl,
            [classes.right]: !rtl,
          })}
        />

        <div
          ref={rightResizeDrag}
          className={classNames(classes.ganttLineDrag, {
            [classes.left]: rtl,
            [classes.right]: !rtl,
          })}
        />

        <div className={classes.ganttLineTitle}>
          <span>{data.name}</span>
        </div>

        {allowProgress && (
          <div
            ref={progressDrag}
            className={classes.ganttLineProgressIndicator}
            style={{
              [rtl ? "right" : "left"]: Math.min(
                width - 10,
                Math.max(0, progressWidth - (progressWidth > 5 ? 5 : 0)),
              ),
            }}
          ></div>
        )}
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
