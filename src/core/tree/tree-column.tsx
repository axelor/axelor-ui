import * as TYPES from "./types";
import { useClassNames } from "../styles";
import { MaterialIcon } from "../../icons/meterial-icon";
import { Box } from "../box";
import styles from "./tree.module.scss";

export function TreeColumn({
  className,
  data,
  children,
  onClick,
}: TYPES.TreeColumnProps) {
  const { name, width } = data;
  const classNames = useClassNames();
  return (
    <div
      key={name}
      className={classNames(className, styles.column)}
      onClick={(e) => onClick && onClick(e, data)}
      {...(width ? { style: { width, maxWidth: width } } : {})}
    >
      {children}
    </div>
  );
}

export function TreeHeaderColumn({
  data,
  sort,
  onSort,
}: TYPES.TreeHeaderColumnProps) {
  const { title } = data;
  const classNames = useClassNames();
  return (
    <TreeColumn
      data={data}
      className={classNames(styles.headerColumn, {
        [styles.sortable]: Boolean(onSort),
      })}
      onClick={onSort}
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
