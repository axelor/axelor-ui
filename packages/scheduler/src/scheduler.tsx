import React, { useCallback } from 'react';
import {
  Calendar,
  momentLocalizer,
  View as CalendarView,
  NavigateAction as CalendarNavigateAction,
} from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

import { Event, Component, View, SchedulerEvent } from './types';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss';

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar as any);

export type NavigationAction = 'NEXT' | 'PREV' | 'TODAY';

const views: View[] = ['month', 'week', 'day'];

export interface SchedulerProps {
  events?: SchedulerEvent[] | undefined;
  view?: View;
  style?: React.CSSProperties;
  components?: Component;
  onEventCreate?(event: Event): void;
  onEventSelect?(event: Event): void;
  onEventDrop?(event: Event): void;
  onEventResize?(event: Event): void;
  onViewChange?(view: View): void;
  onNavigationChange?(date: Date, view: View, action: NavigationAction): void;
}

function Scheduler({
  events,
  view,
  style,
  components,
  onEventCreate,
  onEventSelect,
  onEventDrop,
  onEventResize,
  onViewChange,
  onNavigationChange,
}: SchedulerProps) {
  const handleEventCreate = useCallback(
    ({ start, end }: any) => {
      onEventCreate && onEventCreate({ start, end } as Event);
    },
    [onEventCreate]
  );

  const handleEventSelect = useCallback(
    (event: any, e: React.SyntheticEvent<HTMLElement>) => {
      onEventSelect && onEventSelect(event as Event);
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
      selectable
      {...{
        view: view as View,
        views: views as CalendarView[],
        localizer,
        events,
        components,
        style,
        onSelectSlot: handleEventCreate,
        onSelectEvent: handleEventSelect,
        onEventDrop: handleEventDrop,
        onEventResize: handleEventResize,
        onNavigate: handleNavigateChange,
        onView: handleViewChange,
      }}
    />
  );
}

export default Scheduler;