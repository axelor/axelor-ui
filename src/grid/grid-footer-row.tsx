import React from "react";
import { Box, Popper, useClassNames, usePopperTrigger } from "../core";
import * as TYPES from "./types";

import { GridColumn } from "./grid-column";
import { capitalizeWord } from "./utils";
import { useTranslation } from "./translate";
import styles from "./grid.module.scss";

export const GridFooterRow = React.memo(function GridFooterRow(
  props: TYPES.GridRowProps,
) {
  const {
    className,
    width,
    selected,
    selectedCell,
    columns = [],
    style,
    renderer,
    data,
  } = props;
  const RowRenderer = renderer || "div";
  const rendererProps = renderer ? props : {};
  const classNames = useClassNames();

  return (
    <RowRenderer
      {...rendererProps}
      className={classNames(styles.row, styles.footerRow, className, {
        [styles.selected]: selected,
      })}
      {...((width || style) && {
        style: { width, maxWidth: width, ...style },
      })}
    >
      {columns.map((column, index) => {
        return (
          <GridFooterRowColumn
            key={column.id ?? column.name}
            selected={selectedCell === index}
            index={index}
            data={column}
            row={data}
          />
        );
      })}
    </RowRenderer>
  );
});

function GridFooterRowColumn(
  props: TYPES.GridColumnProps & { row: TYPES.GridRow },
) {
  const { index, selected, data: column, row } = props;

  const textValue = React.useMemo(() => {
    if (!column.aggregate) {
      return null;
    }
    let _value = row.aggregate[column.name];
    if (column.aggregate && column.formatter) {
      _value = column.formatter(column, _value, { [column.name]: _value });
    }
    return _value;
  }, [column, row]);

  const t = useTranslation();
  const {
    open: popperOpen,
    targetEl,
    setTargetEl,
  } = usePopperTrigger({ trigger: "hover", delay: { open: 1000, close: 100 } });

  return (
    <GridColumn selected={selected} index={index} data={column} type="footer">
      {column.aggregate && (
        <>
          <span ref={setTargetEl}>{textValue}</span>
          <Popper
            open={popperOpen}
            target={targetEl}
            offset={[7, 0]}
            arrow
            shadow
            rounded
            placement="top"
          >
            <Box p={2}>
              <span>
                {t(capitalizeWord(column.aggregate) as TYPES.GridLabel)} :{" "}
                {textValue}
              </span>
            </Box>
          </Popper>
        </>
      )}
    </GridColumn>
  );
}
