/**
 * @title Row Reorder
 */
import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Grid } from '../grid';
import { GridState } from '../types';
import { columns, records } from '../demos/demo-data';

export default function () {
  const [state, setState] = React.useState<GridState>({
    columns: [],
    rows: [],
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <Grid
        allowSelection
        allowCheckboxSelection
        allowRowReorder
        selectionType="multiple"
        records={records}
        columns={columns}
        state={state}
        setState={setState}
      />
    </DndProvider>
  );
}
