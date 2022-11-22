/**
 * @title Row Reorder
 */
import React from 'react';
import { Button } from '../../core';
import { Grid } from '../grid';
import { GridProvider } from '../grid-provider';
import { columns, records } from '../demos/demo-data';
import useGridState from './useGridState';

export default function Reorder() {
  const [state, setState] = useGridState();
  const [reorder, setReorder] = React.useState(false);

  return (
    <GridProvider>
      <Button onClick={() => setReorder(flag => !flag)}>Toggle reorder</Button>
      <Grid
        allowSelection
        allowCheckboxSelection
        allowRowReorder={reorder}
        selectionType="multiple"
        records={records}
        columns={columns}
        state={state}
        setState={setState}
      />
    </GridProvider>
  );
}
