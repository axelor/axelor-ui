/**
 * @title Expanding
 */
import { useEffect, useMemo, useState } from "react";
import { GridRow } from "..";
import { Box, Collapse } from "../../core";
import { Grid } from "../grid";
import { GridProvider } from "../grid-provider";
import { records } from "./demo-data";
import useGridState from "./useGridState";

const columns = [
  { name: "name", title: "Name", type: "String" },
  {
    name: "category",
    title: "Category",
    type: "String",
    options: ["Storage", "Computer", "Other"],
  },
  { name: "color", title: "Color", type: "String" },
  {
    name: "price",
    title: "Price",
    type: "String",
    aggregate: "avg",
  },
];

const bulkRecords = [
  ...records,
  ...records.map((record) => ({
    ...record,
    id: record.id + records.length,
  })),
];

export default function Expanding() {
  const [state, setState] = useGridState();

  return (
    <GridProvider>
      <Box style={{ display: "flex", maxHeight: 500 }}>
        <Grid
          allowColumnResize
          allowGrouping
          allowSorting
          allowSelection
          allowCheckboxSelection
          allowCellSelection
          allowRowExpand
          sortType="state"
          selectionType="multiple"
          records={bulkRecords}
          columns={columns}
          state={state}
          setState={setState}
          rowDetailsRenderer={Details}
        />
      </Box>
    </GridProvider>
  );
}

const detailsColumns = [
  { name: "variant", title: "Variant", type: "String" },
  {
    name: "price",
    title: "Price",
    type: "String",
  },
];

function Details({ data }: { data: GridRow }) {
  const [show, setShow] = useState(false);
  const [state, setState] = useGridState();
  const { record } = data;
  const detailsRecords = useMemo(
    () =>
      new Array(10).fill({}).map((_, ind) => ({
        variant: `${record.name} ${ind + 1}`,
        price: record.price * (ind + 1),
      })),
    [record],
  );

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <Collapse in={show}>
      <Box d="flex" p={3} style={{ maxHeight: 300 }}>
        <Grid
          allowSorting
          allowSelection
          allowCheckboxSelection
          allowCellSelection
          sortType="state"
          selectionType="multiple"
          records={detailsRecords}
          columns={detailsColumns}
          state={state}
          setState={setState}
        />
      </Box>
    </Collapse>
  );
}
