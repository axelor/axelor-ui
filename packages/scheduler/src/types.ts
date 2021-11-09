import React from 'react';

export type StringOrDate = string | Date;

export type View = 'month' | 'week' | 'day';

export interface SchedulerEvent {
  id: string | number;
  title: string;
  start?: Date;
  end?: Date;
  allDay?: boolean;
}

export interface Component {
  event: React.JSXElementConstructor<any>;
}

export interface Event {
  start: StringOrDate;
  end: StringOrDate;
  allDay: boolean;
  event: SchedulerEvent;
}
