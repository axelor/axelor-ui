/**
 * @title Selection
 */

import React, { useState } from 'react';

import Scheduler from '../scheduler';
import { Event, SchedulerEvent } from '../types';
import _events from './events';

function selectable() {
  const [events, setEvents] = useState<SchedulerEvent[]>(_events);

  const handleEventCreate = ({ start, end }: Event) => {
    const title = window.prompt('New Event Name');
    if (title) {
      setEvents(events => [...events, { start, end, title } as SchedulerEvent]);
    }
  };

  return (
    <Scheduler
      events={events}
      onEventCreate={handleEventCreate}
      style={{ height: 500 }}
    />
  );
}

export default selectable;