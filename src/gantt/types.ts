import React from "react";

export type Record = {
  id: number;
};
export type GanttType = "year" | "month" | "week" | "day";
export type GanttField = {
  name: string;
  title?: string;
  width?: number;
  formatter?: (field: GanttField, value: any, data: GanttRecord) => any;
  renderer?: React.FC<{
    data: GanttRecord;
    field: GanttField;
    value: string | number;
  }>;
};
export type GanttHeaderItem = {
  title: string;
  width: number;
  hours?: number;
  highlight?: boolean;
};

export type GanttRecord = {
  id: number;
  name?: string;
  data?: Record; // original record
  user?: Record | null;
  parent?: Record | null;
  startDate?: string;
  endDate?: string;
  duration?: number | string;
  progress?: number | string;
  sequence?: number;
  startToStart?: Record[];
  startToFinish?: Record[];
  finishToStart?: Record[];
  finishToFinish?: Record[];
  $color?: string;
  _children?: number[];
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
  onRecordView?: (record: GanttRecord, index?: number) => any;
  onRecordUpdate?: (record: GanttRecord, changes?: any) => any;
  onRecordConnect?: (connectProps: ConnectProps) => any;
  onRecordDisconnect?: (connectProps: ConnectProps) => any;
}
