import React from 'react';
import { Box } from '@axelor-ui/core';
import { useClassNames } from '@axelor-ui/core';
import * as TYPES from './types';
import classes from './gantt.module.css';

const GanttTableHeader = React.memo(function GanttTableHeader({
  items,
}: Pick<TYPES.GanttProps, 'items'>) {
  return (
    <div className={classes.tableHeader}>
      {items.map(item => (
        <div key={item.name} className={classes.tableHeaderCell}>
          {item.title}
        </div>
      ))}
    </div>
  );
});

const GanttTableBodyRow = React.memo(function GanttTableBodyRow({
  active,
  onClick,
  index,
  items,
  data,
}: {
  active: boolean;
  index: number;
  onClick: (index: number) => void;
  data: TYPES.GanttRecord;
  items: TYPES.GanttProps['items'];
}) {
  const classNames = useClassNames();
  return (
    <div
      className={classNames(classes.tableBodyRow, {
        [classes.active]: active,
      })}
      onClick={e => onClick(index)}
    >
      {items.map(item => {
        const value: any = (data as any)[item.name];
        return (
          <div key={item.name} className={classes.tableBodyRowCell}>
            {item.formatter ? item.formatter(value, item) : value}
          </div>
        );
      })}
    </div>
  );
});

export function GanttTable(props: {
  activeRowIndex: number;
  setActiveRowIndex: (index: number) => void;
  items: TYPES.GanttProps['items'];
  records: TYPES.GanttProps['records'];
}) {
  const { items, records, activeRowIndex, setActiveRowIndex } = props;
  return (
    <Box className={classes.table}>
      <GanttTableHeader items={items} />
      <div className={classes.tableBody}>
        {records.map((record, ind) => (
          <GanttTableBodyRow
            key={ind}
            index={ind}
            items={items}
            data={record}
            active={activeRowIndex === ind}
            onClick={setActiveRowIndex}
          />
        ))}
      </div>
    </Box>
  );
}
