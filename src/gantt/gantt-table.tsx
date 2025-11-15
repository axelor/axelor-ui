import React from "react";

import { Box, useClassNames } from "../core";
import { findDataProp, makeTestId } from "../core/system/utils";

import * as TYPES from "./types";

import classes from "./gantt.module.scss";

function Column({
  field,
  ...props
}: { field: TYPES.GanttField } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...(field.width && {
        style: {
          minWidth: field.width,
          maxWidth: field.width,
        },
      })}
      {...props}
    />
  );
}

const GanttTableHeader = React.memo(function GanttTableHeader(
  props: Pick<TYPES.GanttProps, "items">,
) {
  const { items } = props;
  const testId = findDataProp(props, "data-testid");
  return (
    <div className={classes.tableHeader} data-testid={testId}>
      {items.map((item) => (
        <Column
          key={item.name}
          field={item}
          className={classes.tableHeaderCell}
          data-testid={makeTestId(testId, "column", item.name)}
        >
          {item.title}
        </Column>
      ))}
    </div>
  );
});

const GanttTableBodyRow = React.memo(function GanttTableBodyRow(props: {
  active: boolean;
  index: number;
  onClick: (index: number) => void;
  record: TYPES.GanttRecord;
  items: TYPES.GanttProps["items"];
  onView?: TYPES.GanttProps["onRecordView"];
}) {
  const { active, onClick, onView, index, items, record } = props;
  const { taskData: data } = record;
  const classNames = useClassNames();
  const testId = findDataProp(props, "data-testid");
  return (
    <div
      className={classNames(classes.tableBodyRow, {
        [classes.active]: active,
      })}
      onClick={() => onClick(data.id)}
      onDoubleClick={() => onView?.(record, index)}
      data-testid={testId}
    >
      {items.map((item) => {
        const $value = item.formatter
          ? item.formatter(item, data[item.name], data)
          : data[item.name];
        function renderer() {
          const Component = item.renderer!;
          return <Component field={item} data={data} value={$value} />;
        }
        return (
          <Column
            key={item.name}
            field={item}
            className={classes.tableBodyRowCell}
            data-testid={makeTestId(testId, "column", item.name)}
          >
            <div className={classes.tableBodyRowCellContent}>
              {item.renderer ? renderer() : $value}
            </div>
          </Column>
        );
      })}
    </div>
  );
});

export function GanttTable(props: {
  activeRow: null | number;
  setActiveRow: (index: number) => void;
  items: TYPES.GanttProps["items"];
  records: TYPES.GanttProps["records"];
  onView?: TYPES.GanttProps["onRecordView"];
}) {
  const { items, records, activeRow, setActiveRow, onView } = props;
  const classNames = useClassNames();
  const testId = findDataProp(props, "data-testid");
  return (
    <Box
      className={classNames("table-grid", classes.table)}
      data-testid={testId}
    >
      <GanttTableHeader
        items={items}
        data-testid={makeTestId(testId, "header")}
      />
      <div
        className={classes.tableBody}
        data-testid={makeTestId(testId, "body")}
      >
        {records.map((record, ind) => (
          <GanttTableBodyRow
            key={ind}
            index={ind}
            items={items}
            record={record}
            active={String(activeRow) === String(record.id)}
            onView={onView}
            onClick={setActiveRow}
            data-testid={makeTestId(testId, "row", record.id)}
          />
        ))}
      </div>
    </Box>
  );
}
