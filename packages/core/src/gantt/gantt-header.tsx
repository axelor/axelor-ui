import React from 'react';
import * as TYPES from './types';
import classes from './gantt.module.css';

function RenderList({ data }: { data: TYPES.GanttHeaderItem[] }) {
  return (
    <>
      {data.map((item, i: number) => (
        <div className={classes.block} key={i} style={{ width: item.width }}>
          {item.title}
        </div>
      ))}
    </>
  );
}

export const GanttHeader = React.memo(function GanttHeader(props: {
  list: TYPES.GanttHeaderItem[];
  subList: TYPES.GanttHeaderItem[];
}) {
  const { list, subList } = props;
  return (
    <div>
      <div className={classes.header}>
        <RenderList data={list} />
      </div>
      <div className={classes.subHeader}>
        <RenderList data={subList} />
      </div>
    </div>
  );
});
