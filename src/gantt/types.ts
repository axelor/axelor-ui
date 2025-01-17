import React from "react";

export type GanttData = {
  id: number;
  [k: string]: any;
};
export type GanttType = "year" | "month" | "week" | "day";
export type GanttField = {
  name: string;
  title?: string;
  width?: number;
  formatter?: (field: GanttField, value: any, data: GanttData) => any;
  renderer?: React.JSXElementConstructor<GanttFieldRenderer>;
};

export type GanttFieldRenderer = {
  /** The original record */
  data: GanttData;
  /** the field to render */
  field: GanttField;
  /** the formatted record value */
  value: any;
};

export type GanttHeaderItem = {
  title: string;
  width: number;
  hours?: number;
  highlight?: boolean;
};

export type GanttRecord = {
  /**
   * The task id
   */
  id: number;
  /**
   * The name of the task
   */
  name?: string;
  /**
   * The parent record
   */
  parent?: GanttData | null;
  /**
   * The date when a task is scheduled to begin.
   */
  startDate?: string;
  /**
   * The date when a task is scheduled to be completed.
   */
  endDate?: string;
  /**
   * The task duration.
   */
  duration?: number | string;
  /**
   * The task progress
   */
  progress?: number | string;
  /**
   * The task sequence
   */
  sequence?: number;
  startToStart?: GanttData[];
  startToFinish?: GanttData[];
  finishToStart?: GanttData[];
  finishToFinish?: GanttData[];
  /**
   * Sets the color (background-color) of the task
   */
  $color?: string;
  /**
   * The original record
   */
  taskData: GanttData;
};

export type GanttEdgeType = "start" | "finish";
export type GanttPoint = {
  x: number;
  y: number;
};

export type GanttEdge = {
  source: number;
  target: number;
  start: GanttEdgeType;
  end: GanttEdgeType;
  startPoint?: GanttPoint;
  endPoint?: GanttPoint;
  bendPoints?: GanttPoint[];
};

export type GanttVirtualLinePoint = {
  x: number;
  y: number;
  type: GanttEdgeType;
};

export type GanttDragItem = {
  id: number;
  type: string;
  refs?: any;
  lineRef?: React.RefObject<HTMLDivElement>;
  setVirtualLineTarget?: (offset: GanttVirtualLinePoint) => void;
  connect?: boolean;
};

export interface ConnectProps {
  startId: number;
  finishId: number;
  source: GanttEdgeType;
  target: GanttEdgeType;
}

export type GanttConfig = {
  progress?: boolean;
  startDate?: boolean;
  endDate?: boolean;
  duration?: boolean;
};

export interface GanttProps {
  className?: string;
  view: GanttType;
  items: GanttField[];
  records: GanttRecord[];
  config?: GanttConfig;
  /**
   * Called on task double click
   * @param record the original record
   * @param index the record index
   */
  onRecordView?: (record: GanttData, index?: number) => void;
  /**
   * Called when task drag&drop ends
   * @param record the original record
   * @param changes the changes made on the task
   */
  onRecordUpdate?: (
    record: GanttData,
    changes: Partial<GanttRecord>,
  ) => Promise<void> | void;
  onRecordConnect?: (connectProps: ConnectProps) => Promise<void> | void;
  onRecordDisconnect?: (connectProps: ConnectProps) => Promise<void> | void;
}
