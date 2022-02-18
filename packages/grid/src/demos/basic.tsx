/**
 * @title Basic
 */
import { Box } from '@axelor-ui/core';
import { Grid } from '../grid';
import { GridProvider } from '../grid-provider';
import { records } from './demo-data';
import useGridState from './useGridState';

const columns = [
  { name: 'name', title: 'Name', type: 'String' },
  {
    name: 'category',
    title: 'Category',
    type: 'String',
    options: ['Storage', 'Computer', 'Other'],
  },
  { name: 'color', title: 'Color', type: 'String' },
  {
    name: 'price',
    title: 'Price',
    type: 'String',
    aggregate: 'avg',
  },
];

const bulkRecords = [
  ...records,
  ...records.map(record => ({
    ...record,
    id: record.id + records.length,
  })),
];

export default function Basic() {
  const [state, setState] = useGridState();

  return (
    <GridProvider>
      <Box style={{ display: 'flex', maxHeight: 500 }}>
        <Grid
          allowColumnResize
          allowGrouping
          allowSorting
          allowSelection
          allowCheckboxSelection
          allowCellSelection
          allowColumnHide
          sortType="state"
          groupingText={'Drag columns here...'}
          selectionType="multiple"
          records={bulkRecords}
          columns={columns}
          state={state}
          setState={setState}
        />
      </Box>
    </GridProvider>
  );
}
