/**
 * @title Searching
 */
import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Box, Input } from '@axelor-ui/core';
import { Grid } from '../grid';
import { isRowCheck } from '../utils';
import { GridState, GridColumn } from '../types';

import { columns, records as records_data } from './demo-data';

const SearchContext = React.createContext({});

function SearchRow(props: any) {
  return <div {...props} />;
}

function SearchColumn({ column }: { column: GridColumn }) {
  const { onSearch }: any = React.useContext(SearchContext);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.keyCode === 13) {
      e.preventDefault();
      onSearch && onSearch(column, (e.target as HTMLInputElement).value);
    }
  }

  return !isRowCheck(column) ? (
    <Input placeholder={column.title} onKeyDown={handleKeyDown} />
  ) : null;
}

export default function () {
  const [records, setRecords] = React.useState([...records_data]);
  const [state, setState] = React.useState<GridState>({
    columns: [],
    rows: [],
  });

  const onSearch = React.useCallback(
    (column: GridColumn, value: string) => {
      if (value) {
        setRecords(
          records_data.filter((record: any) =>
            ((record[column.name] as string) || '')
              .toString()
              .toLowerCase()
              .includes(`${value}`.toLowerCase())
          )
        );
      } else {
        setRecords([...records_data]);
      }
    },
    [setRecords]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Box>
        <SearchContext.Provider
          value={React.useMemo(() => ({ onSearch }), [onSearch])}
        >
          <Grid
            allowSearch
            allowSelection
            allowCellSelection
            allowCheckboxSelection
            searchRowRenderer={SearchRow}
            searchColumnRenderer={SearchColumn}
            records={records}
            columns={columns}
            state={state}
            setState={setState}
          />
        </SearchContext.Provider>
      </Box>
    </DndProvider>
  );
}
