/**
 * @title Component
 */

import React from 'react';

import { SchedulerEvent } from '../types';
import Basic from './basic';

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
  return <Basic components={components} />;
}

export default Component;
