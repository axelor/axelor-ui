/**
 * @title Basic
 */

import React from 'react';

import Scheduler from '../scheduler';
import events from './events';

function Basic() {
  return <Scheduler events={events} style={{ height: 500 }} />;
}

export default Basic;
