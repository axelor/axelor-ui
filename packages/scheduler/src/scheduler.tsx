import { useCallback } from 'react';
import * as React from 'react';
import {
  Calendar,
  momentLocalizer,
  View as CalendarView,
  NavigateAction as CalendarNavigateAction,
} from 'react-big-calendar';
import { useTheme } from '@axelor-ui/core';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

import { Event, Component, View, SchedulerEvent } from './types';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar as any);

export type NavigationAction = 'NEXT' | 'PREV' | 'TODAY';

const views: View[] = ['month', 'week', 'day'];

export interface SchedulerProps {
  events?: SchedulerEvent[] | undefined;
  view?: View;
  selectable?: boolean | 'ignoreEvents';
  style?: React.CSSProperties;
  components?: Component;
  eventStyler?(event: Event): { className?: string; style?: object };
  onEventCreate?(event: Event): void;
  onEventSelect?(event: Event, e?: React.SyntheticEvent<HTMLElement>): void;
  onEventDrop?(event: Event): void;
  onEventResize?(event: Event): void;
  onViewChange?(view: View): void;
  onNavigationChange?(date: Date, view: View, action: NavigationAction): void;
}

function Scheduler({
  events,
  view,
  selectable,
  style,
  components,
  eventStyler,
  onEventCreate,
  onEventSelect,
  onEventDrop,
  onEventResize,
  onViewChange,
  onNavigationChange,
}: SchedulerProps) {
  const { dir } = useTheme();
  const rtl = dir === 'rtl';

  const handleEventStyler = useCallback(
    (event: any, start: any, end: any) => {
      return eventStyler
        ? eventStyler({
            event,
            start,
            end,
          } as Event)
        : {};
    },
    [eventStyler]
  );

  const handleEventCreate = useCallback(
    ({ start, end }: any) => {
      onEventCreate && onEventCreate({ start, end } as Event);
    },
    [onEventCreate]
  );

  const handleEventSelect = useCallback(
    (event: any, e: React.SyntheticEvent<HTMLElement>) => {
      onEventSelect && onEventSelect({ event } as Event, e);
    },
    [onEventSelect]
  );

  const handleEventDrop = useCallback(
    ({ event, start, end, isAllDay }: any) => {
      onEventDrop &&
        onEventDrop({ start, end, allDay: isAllDay, event } as Event);
    },
    [onEventDrop]
  );

  const handleEventResize = useCallback(
    ({ event, start, end, isAllDay }: any) => {
      onEventResize &&
        onEventResize({ start, end, allDay: isAllDay, event } as Event);
    },
    [onEventResize]
  );

  const handleNavigateChange = useCallback(
    (date: Date, view: CalendarView, action: CalendarNavigateAction) => {
      onNavigationChange &&
        onNavigationChange(date, view as View, action as NavigationAction);
    },
    [onNavigationChange]
  );

  const handleViewChange = useCallback(
    (view: CalendarView) => {
      onViewChange && onViewChange(view as View);
    },
    [onViewChange]
  );

  return (
    <DragAndDropCalendar
      popup
      rtl={rtl}
      view={view}
      views={views}
      localizer={localizer}
      events={events}
      components={components as any}
      selectable={selectable}
      style={style}
      eventPropGetter={handleEventStyler}
      onSelectSlot={handleEventCreate}
      onSelectEvent={handleEventSelect}
      onEventDrop={handleEventDrop}
      onEventResize={handleEventResize}
      onNavigate={handleNavigateChange}
      onView={handleViewChange}
    />
  );
}

export default Scheduler;
