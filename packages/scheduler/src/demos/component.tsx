/**
 * @title Component
 */

import React from 'react';

import Scheduler from '../scheduler';
import events from './events';
import { SchedulerEvent } from '../types';

function CustomEvent({ event }: { event: SchedulerEvent }) {
  return (
    <span style={{ fontStyle: 'italic' }}>
      <strong>{event.title}</strong>
    </span>
  );
}

const components = {
  event: CustomEvent,
};

function Component() {
  return (
    <Scheduler
      events={events}
      components={components}
      style={{ height: 500 }}
    />
  );
}

export default Component;
