import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import { Box } from '../box';
import { Gantt } from './gantt';
import { GANTT_TYPES } from './utils';
import { styleNames } from '../styles';

import response from './data';

export default {
  component: Gantt,
  title: 'Components/Gantt',
};

const connectSetTypes: any = {
  start_finish: 'startToFinish',
  finish_finish: 'finishToFinish',
  start_start: 'startToStart',
  finish_start: 'finishToStart',
};

export const Basic = () => {
  const [records, setRecords] = React.useState(response.data);
  const [view, setView] = React.useState(GANTT_TYPES.MONTH);
  const handleRecordUpdate = React.useCallback((record, changes) => {
    setRecords(records => {
      return records.map(r => (r.id === record.id ? { ...r, ...changes } : r));
    });
  }, []);

  const handleRecordConnect = React.useCallback(
    ({ startId, finishId, source, target }) => {
      setRecords(records => {
        const set = connectSetTypes[`${source}_${target}`];
        const index = records.findIndex(r => r.id === finishId);
        const oldSet = records[index][set] || [];
        if (!oldSet.find(obj => obj.id === startId)) {
          records[index] = {
            ...records[index],
            [set]: (records[index][set] || []).concat([{ id: startId }]),
          };
          return [...records];
        }
        return records;
      });
    },
    []
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Box>
        <Box style={{ width: 300, marginBottom: 10 }}>
          <select
            value={view}
            onChange={e => setView(e.target.value as any)}
            className={styleNames('form-control')}
          >
            <option value={GANTT_TYPES.DAY}>Day</option>
            <option value={GANTT_TYPES.WEEK}>Week</option>
            <option value={GANTT_TYPES.MONTH}>Month</option>
            <option value={GANTT_TYPES.YEAR}>Year</option>
          </select>
        </Box>
        <Gantt
          view={view}
          items={[]}
          records={records}
          onRecordConnect={handleRecordConnect}
          onRecordUpdate={handleRecordUpdate}
        />
      </Box>
    </DndProvider>
  );
};
