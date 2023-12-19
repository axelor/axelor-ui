import React, {
  SyntheticEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Box,
  Divider,
  Input,
  Menu,
  MenuDivider,
  MenuItem,
  useClassNames,
} from "../core";

import { MaterialIcon } from "../icons/material-icon";
import { GridColumn, GridColumnProps } from "./grid-column";
import { GridColumResizer } from "./grid-column-resizer";
import styles from "./grid.module.scss";
import * as TYPES from "./types";
import { isRowCheck } from "./utils";
import { useTranslation } from "./translate";

export type ResizeHandler = (
  e: React.DragEvent<HTMLElement>,
  column: TYPES.GridColumn,
  index: number,
) => void;

export interface GridHeaderColumnProps extends GridColumnProps {
  sort?: null | "asc" | "desc";
  checkType?: "checked" | "unchecked" | "indeterminate";
  selectionType?: TYPES.GridProps["selectionType"];
  groupBy?: TYPES.GridState["groupBy"];
  columns?: TYPES.GridColumn[];
  onGroup?: (e: SyntheticEvent, group: TYPES.GridGroup) => void;
  onUngroup?: (e: SyntheticEvent, group: TYPES.GridGroup) => void;
  onSort?: (
    e: SyntheticEvent,
    column: TYPES.GridColumn,
    columnIndex: number,
    sortOrder?: "asc" | "desc",
  ) => void;
  onShow?: (e: SyntheticEvent, column: TYPES.GridColumn) => void;
  onHide?: (e: SyntheticEvent, column: TYPES.GridColumn) => void;
  onCheckAll?: (checked: boolean) => void;
  onResizeStart?: ResizeHandler;
  onResize?: ResizeHandler;
  onResizeEnd?: ResizeHandler;
  onCustomize?: TYPES.GridProps["onColumnCustomize"];
}

function GridHeaderCheckbox({
  checkType,
  onCheckAll,
}: Pick<GridHeaderColumnProps, "checkType" | "onCheckAll">) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const canCheck = Boolean(onCheckAll);
  const classNames = useClassNames();
  React.useEffect(() => {
    const input = inputRef.current;
    if (checkType && input) {
      let checked = false,
        indeterminate = false;
      if (checkType === "checked") {
        checked = true;
      } else if (checkType === "indeterminate") {
        indeterminate = true;
      }
      input.checked = checked;
      input.indeterminate = indeterminate;
    }
  }, [canCheck, checkType]);

  return (
    <span className={classNames(styles.headerColumnTitle, styles.center)}>
      <Input
        ref={inputRef}
        type="checkbox"
        key={canCheck ? "check-all" : "check-all-disable"}
        {...(onCheckAll
          ? {
              onChange: (e) =>
                onCheckAll((e.target as HTMLInputElement).checked),
            }
          : { defaultChecked: false })}
        tabIndex={-1}
      />
    </span>
  );
}

export const GridHeaderColumn = React.memo(function GridHeaderColumn(
  props: GridHeaderColumnProps,
) {
  const {
    data,
    columns,
    sort,
    index,
    checkType,
    selectionType,
    onCheckAll,
    onSort,
    onShow,
    onHide,
    onGroup,
    onUngroup,
    onResizeStart,
    onResize,
    onResizeEnd,
    onCustomize,
  } = props;

  const classNames = useClassNames();
  const targetRef = useRef<HTMLSpanElement | null>(null);
  const [show, setShow] = useState(false);
  const t = useTranslation();

  const handleShow = useCallback(() => setShow(true), []);
  const handleHide = useCallback(() => setShow(false), []);

  const RenderMenuItem = useMemo(
    () =>
      function RenderMenuItem(props: any) {
        const { icon, children, onClick, ...rest } = props;
        return (
          <MenuItem
            onClick={(e: SyntheticEvent) => {
              handleHide();
              onClick?.(e);
            }}
            {...rest}
          >
            <Box d="flex" alignItems="center" gap={4}>
              {icon || <span className={styles.headerColumnMenuIcon} />}
              {children}
            </Box>
          </MenuItem>
        );
      },
    [handleHide],
  );

  function renderColumn(column: TYPES.GridColumn, index: number) {
    if (isRowCheck(column)) {
      return (
        selectionType !== "single" && (
          <GridHeaderCheckbox checkType={checkType} onCheckAll={onCheckAll} />
        )
      );
    }

    const canResize = column.name !== "__reorder__" && !column.action;
    const canSort = onSort && column.sortable !== false;
    const hasMenu =
      Boolean(column.title?.trim()) &&
      Boolean(
        canSort || onGroup || onUngroup || onShow || onHide || onCustomize,
      );
    return (
      <>
        <span
          className={classNames(styles.headerColumnTitle, column.$headerCss, {
            [styles.resizable]: Boolean(onResize),
          })}
          onClick={(e) => {
            const dropdownEl = targetRef.current;
            if (
              dropdownEl &&
              (e.target === dropdownEl ||
                dropdownEl?.contains?.(e.target as Node))
            )
              return;
            canSort && onSort?.(e, data, index);
          }}
        >
          <Box as="span" flex={1} d="inline-flex" alignItems="center">
            <span>{column.title}</span>
            {canSort && sort && (
              <Box d="inline-flex" ms={1} as="span">
                <MaterialIcon
                  className={classNames({
                    [styles.ascSortIcon]: sort === "asc",
                  })}
                  fontSize="1.25rem"
                  icon="sort"
                />
              </Box>
            )}
          </Box>
          {hasMenu && (
            <span
              className={classNames(styles.headerColumnMenuButton, {
                [styles.active]: show,
              })}
              ref={targetRef}
              onClick={handleShow}
            >
              <MaterialIcon icon="arrow_drop_down" />
            </span>
          )}
        </span>

        {canResize && onResizeStart && onResize && onResizeEnd ? (
          <GridColumResizer
            className={styles.columnResizer}
            draggable={true}
            onDragStart={(e: React.DragEvent<HTMLElement>) =>
              onResizeStart(e, column, index)
            }
            onDragEnd={(e: React.DragEvent<HTMLElement>) =>
              onResizeEnd(e, column, index)
            }
            onDrag={(e: React.DragEvent<HTMLElement>) =>
              onResize(e, column, index)
            }
          />
        ) : (
          <span className={classNames(styles.columnResizer, styles.fixed)}>
            <Divider vertical />
          </span>
        )}

        <Menu
          target={targetRef.current}
          show={show}
          navigation
          onHide={() => setShow(false)}
          offset={[0, -8]}
          placement="bottom-start"
        >
          {canSort && (
            <>
              <RenderMenuItem
                icon={
                  <MaterialIcon
                    className={styles.ascSortIcon}
                    fontSize="1.25rem"
                    icon="sort"
                  />
                }
                onClick={(e: SyntheticEvent) =>
                  onSort?.(e, column, index, "asc")
                }
              >
                {t("Sort Ascending")}
              </RenderMenuItem>

              <RenderMenuItem
                icon={<MaterialIcon fontSize="1.25rem" icon="sort" />}
                onClick={(e: SyntheticEvent) =>
                  onSort?.(e, column, index, "desc")
                }
              >
                {t("Sort Descending")}
              </RenderMenuItem>
            </>
          )}

          {(onGroup || onUngroup) && (
            <>
              {canSort && <MenuDivider />}

              <MenuItem
                onClick={(e: SyntheticEvent) => {
                  handleHide();
                  onGroup?.(e, { name: column.name });
                }}
              >
                <Box d="flex" alignItems="center" gap={4}>
                  <span className={styles.headerColumnMenuIcon} />
                  {t("Group by")}
                  <i>{column.title}</i>
                </Box>
              </MenuItem>

              <MenuItem
                onClick={(e: SyntheticEvent) => {
                  handleHide();
                  onUngroup?.(e, { name: column.name });
                }}
              >
                <Box d="flex" alignItems="center" gap={4}>
                  <span className={styles.headerColumnMenuIcon} />
                  {t("Ungroup")}
                </Box>
              </MenuItem>
            </>
          )}

          {onHide && (
            <>
              {(canSort || onGroup || onUngroup) && <MenuDivider />}

              <MenuItem
                onClick={(e: SyntheticEvent) => {
                  handleHide();
                  onHide(e, column);
                }}
              >
                <Box d="flex" alignItems="center" gap={4}>
                  <span className={styles.headerColumnMenuIcon} />
                  {t("Hide")}
                  <i>{column.title}</i>
                </Box>
              </MenuItem>
            </>
          )}

          {onShow &&
            columns
              ?.filter(
                (c) => c.title && c.visible === false && c.hidden !== true,
              )
              .map((column) => (
                <MenuItem
                  key={column.id ?? column.name}
                  onClick={(e: SyntheticEvent) => {
                    handleHide();
                    onShow(e, column);
                  }}
                >
                  <Box d="flex" alignItems="center" gap={4}>
                    <span className={styles.headerColumnMenuIcon} />
                    {t("Show")}
                    <i>{column.title}</i>
                  </Box>
                </MenuItem>
              ))}

          {onCustomize && (
            <>
              {(canSort || onGroup || onUngroup || onHide || onShow) && (
                <MenuDivider />
              )}
              <MenuItem
                onClick={(e: SyntheticEvent) => {
                  handleHide();
                  onCustomize(e);
                }}
              >
                <Box d="flex" alignItems="center" gap={4}>
                  <span className={styles.headerColumnMenuIcon} />
                  {t("Customize...")}
                </Box>
              </MenuItem>
            </>
          )}
        </Menu>
      </>
    );
  }

  return (
    <GridColumn
      {...(data.action
        ? {
            className: styles.action,
          }
        : {})}
      type="header"
      index={index}
      data={data}
    >
      {renderColumn(data, index)}
    </GridColumn>
  );
});
