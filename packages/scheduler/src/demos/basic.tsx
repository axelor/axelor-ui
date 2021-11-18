/**
 * @title Basic
 */

import { useState } from 'react';

import Scheduler, { SchedulerProps } from '../scheduler';
import { SchedulerEvent } from '../types';
import _events from './events';

let id = 0;

function WithContainer() {
  return function Basic(props: SchedulerProps) {
    const [events, setEvents] = useState<any[]>(_events);

    const handleEventCreate: SchedulerProps['onEventCreate'] = ({
      start,
      end,
    }) => {
      const title = window.prompt('New Event Name');

      if (title) {
        setEvents(events => [
          ...events,
          { id: id++, start, end, title } as SchedulerEvent,
        ]);
      }
    };

    const handleEventDrop: SchedulerProps['onEventDrop'] = ({
      event,
      start,
      end,
      allDay: _allDay,
    }) => {
      let { allDay } = event;

      if (!event.allDay && _allDay) {
        allDay = true;
      } else if (event.allDay && !_allDay) {
        allDay = false;
      }

      setEvents(events =>
        events.map(existingEvent =>
          existingEvent.id == event.id
            ? ({ ...existingEvent, start, end, allDay } as SchedulerEvent)
            : existingEvent
        )
      );
    };

    const handleResizeEvent: SchedulerProps['onEventResize'] = ({
      event,
      start,
      end,
    }) => {
      setEvents(events =>
        events.map(existingEvent =>
          existingEvent.id == event.id
            ? ({ ...existingEvent, start, end } as SchedulerEvent)
            : existingEvent
        )
      );
    };

    return (
      <Scheduler
        events={events}
        style={{ height: 500 }}
        onEventCreate={handleEventCreate}
        onEventDrop={handleEventDrop}
        onEventResize={handleResizeEvent}
        {...props}
      />
    );
  };
}

export default WithContainer();
