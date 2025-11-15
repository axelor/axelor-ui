import { MaterialIcon } from "../../icons/material-icon";
import { Box } from "../box";
import { useClassNames } from "../styles";
import { findAriaProp, findDataProp } from "../system/utils";
import * as TYPES from "./types";

import styles from "./tree.module.scss";

export function TreeColumn({
  className,
  data,
  children,
  onClick,
  role,
  ...rest
}: TYPES.TreeColumnProps) {
  const { name, width } = data;
  const classNames = useClassNames();
  const testId = findDataProp(rest, "data-testid");
  const ariaSort = findAriaProp(rest, "aria-sort");
  const ariaColIndex = findAriaProp(rest, "aria-colindex");

  return (
    <div
      key={name}
      className={classNames(className, styles.column)}
      onClick={(e) => onClick && onClick(e, data)}
      role={role}
      aria-sort={ariaSort}
      aria-colindex={ariaColIndex}
      {...(width ? { style: { width, maxWidth: width } } : {})}
      data-testid={testId}
    >
      {children}
    </div>
  );
}

export function TreeHeaderColumn({
  data,
  sort,
  onSort,
  ...rest
}: TYPES.TreeHeaderColumnProps) {
  const { title } = data;
  const classNames = useClassNames();
  const testId = findDataProp(rest, "data-testid");
  const ariaColIndex = findAriaProp(rest, "aria-colindex");
  const ariaSort = sort
    ? sort === "asc"
      ? "ascending"
      : "descending"
    : onSort
      ? "none"
      : undefined;
  return (
    <TreeColumn
      data={data}
      data-testid={testId}
      className={classNames(styles.headerColumn, {
        [styles.sortable]: Boolean(onSort),
      })}
      onClick={onSort}
      role="columnheader"
      aria-sort={ariaSort}
      aria-colindex={ariaColIndex}
    >
      <Box as="span" flex={1}>
        {title}
      </Box>
      {sort && (
        <span className={styles.columnSortIcon}>
          <span
            style={{
              display: "inline-flex",
              transform: sort === "asc" ? "scaleY(-1)" : "",
            }}
          >
            <MaterialIcon icon="sort" />
          </span>
        </span>
      )}
    </TreeColumn>
  );
}
