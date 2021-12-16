/**
 * @title Basic
 */
 import { HTML5Backend } from 'react-dnd-html5-backend';
 import { DndProvider } from 'react-dnd';
 import React from 'react';
 import { Box } from '@axelor-ui/core';
 import { Grid } from '../grid';
 import { GridState } from '../types';
 
 import { records } from './demo-data';
 
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
 
 export default function () {
   const [state, setState] = React.useState<GridState>({
     columns: [],
     rows: [],
   });
 
   return (
     <DndProvider backend={HTML5Backend}>
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
     </DndProvider>
   );
 }
 