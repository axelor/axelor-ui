import React from "react";
import { useClassNames } from "../core";
import * as TYPES from "./types";

import { GridColumn } from "./grid-column";
import { capitalizeWord } from "./utils";
import { useTranslation } from "./translate";
import styles from "./grid.module.scss";

export const GridFooterRow = React.memo(function GridFooterRow(
  props: TYPES.GridRowProps
) {
  const {
    className,
    width,
    selected,
    selectedCell,
    columns = [],
    renderer,
    data,
  } = props;
  const t = useTranslation();
  const RowRenderer = renderer || "div";
  const rendererProps = renderer ? props : {};
  const classNames = useClassNames();
  return (
    <RowRenderer
      {...rendererProps}
      className={classNames(styles.row, styles.footerRow, className, {
        [styles.selected]: selected,
      })}
      {...(width && {
        style: { width, maxWidth: width },
      })}
    >
      {columns.map((column, index) => {
        const value = column.aggregate && data.aggregate[column.name];
        return (
          <GridColumn
            key={column.name}
            selected={selectedCell === index}
            index={index}
            data={column}
            type="footer"
          >
            {column.aggregate
              ? `${t(capitalizeWord(column.aggregate) as TYPES.GridLabel)} : ${
                  column.formatter
                    ? column.formatter(column, value, { [column.name]: value })
                    : value
                }`
              : null}
          </GridColumn>
        );
      })}
    </RowRenderer>
  );
});
