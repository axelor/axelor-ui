import React from "react";
import { Box, Divider, Input, Menu, MenuItem, useClassNames } from "../core";

import { MaterialIcon } from "../icons/meterial-icon";
import GridDragElement, { DropHandler } from "./grid-drag-element";
import styles from "./grid.module.scss";
import { useTranslation } from "./translate";
import * as TYPES from "./types";
import { useRTL } from "./utils";

export interface GridHeaderMenuProps extends Pick<TYPES.GridState, "groupBy"> {
  columns?: TYPES.GridColumn[];
  onColumnShow?: (e: React.SyntheticEvent, column: TYPES.GridColumn) => void;
  onColumnHide?: (e: React.SyntheticEvent, column: TYPES.GridColumn) => void;
  onColumnCustomize?: (
    e: React.SyntheticEvent,
    column?: TYPES.GridColumn
  ) => void;
  onColumnDrop?: DropHandler;
  onColumnGroupRemove?: (
    e: React.SyntheticEvent,
    group: TYPES.GridGroup
  ) => void;
}

const GridGroupTag = ({
  name,
  title,
  onDrop,
  onRemove,
}: {
  name: string;
  title?: string;
  onDrop?: GridHeaderMenuProps["onColumnDrop"];
  onRemove?: GridHeaderMenuProps["onColumnGroupRemove"];
}) => {
  const data = React.useMemo(
    () => ({ name, title, $group: true }),
    [name, title]
  );
  return (
    <GridDragElement
      className={styles.groupTagWrapper}
      column={data}
      onDrop={onDrop}
    >
      <div className={styles.groupTag}>
        <label className={styles.groupTagTitle}>{data.title}</label>
        <span
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove && onRemove(e, data);
          }}
        >
          <MaterialIcon icon="close" />
        </span>
      </div>
    </GridDragElement>
  );
};

const CustomMenuItem = ({ onEnter, onClick, ...props }: any) => {
  return (
    <MenuItem
      {...props}
      className={styles.headerMenuItem}
      p={0}
      onClick={onClick}
      onKeyDown={(e) => {
        e.preventDefault();
        if (e.key === "Enter") {
          onClick && onClick(e);
        }
      }}
    />
  );
};

export const GridHeaderMenu = React.memo(function GridHeaderMenu({
  columns = [],
  groupBy,
  onColumnCustomize,
  onColumnShow,
  onColumnHide,
  onColumnDrop,
  onColumnGroupRemove,
}: GridHeaderMenuProps) {
  const [showColumnOptions, setColumnOptions] = React.useState(false);
  const [columnOptionsTarget, setColumnOptionsTarget] =
    React.useState<HTMLElement | null>(null);
  const t = useTranslation();
  const rtl = useRTL();
  const classNames = useClassNames();

  return (
    <>
      <Box
        ref={setColumnOptionsTarget}
        className={styles.columnOptions}
        onClick={() => setColumnOptions(true)}
      >
        <MaterialIcon icon="more_vert" />
      </Box>
      <Menu
        className={classNames("table-popover", styles.columnOptionsMenu)}
        navigation
        placement={`bottom-${rtl ? "start" : "end"}`}
        target={columnOptionsTarget}
        show={showColumnOptions}
        onHide={() => setColumnOptions(false)}
      >
        {columns
          .filter((c) => c.title)
          .map((column) => {
            const { visible = true } = column;
            function toggle(e: React.SyntheticEvent) {
              visible && onColumnHide && onColumnHide(e, column);
              !visible && onColumnShow && onColumnShow(e, column);
            }
            function render() {
              return (
                <Box py={1} d="flex" px={3}>
                  <Input
                    type="checkbox"
                    checked={visible}
                    onChange={() => {}}
                  />
                  <Box
                    className={styles.columnOptionMenuTitle}
                    as="span"
                    ms={2}
                  >
                    {column.title}
                  </Box>
                </Box>
              );
            }
            return (
              <CustomMenuItem key={column.name} onClick={toggle}>
                {onColumnDrop ? (
                  <GridDragElement
                    className={styles.dragColumn}
                    column={column}
                    onDrop={onColumnDrop}
                  >
                    {render()}
                  </GridDragElement>
                ) : (
                  render()
                )}
              </CustomMenuItem>
            );
          })}
        {onColumnDrop && (
          <>
            <Divider aria-disabled="true" />
            <GridDragElement
              canDrag={false}
              canDrop={true}
              onDrop={onColumnDrop}
              className={styles.dragColumnArea}
              aria-disabled="true"
            >
              <Box className={styles.groupTagContainer}>
                {(groupBy || []).length === 0 && (
                  <Box className={styles.groupPlaceholder}>{t("Groups")}</Box>
                )}
                {(groupBy || []).map((group) => {
                  const column = columns.find((x) => x.name === group.name);
                  return (
                    <GridGroupTag
                      key={group.name}
                      title={column && column.title}
                      name={group.name}
                      onDrop={onColumnDrop}
                      onRemove={onColumnGroupRemove}
                    />
                  );
                })}
              </Box>
            </GridDragElement>
          </>
        )}
        {onColumnCustomize && (
          <>
            <Divider aria-disabled="true" />
            <CustomMenuItem
              onClick={(e: React.SyntheticEvent) => {
                onColumnCustomize(e);
                setColumnOptions(false);
              }}
            >
              <Box as="span" ms={2}>
                {t("Customize...")}
              </Box>
            </CustomMenuItem>
          </>
        )}
      </Menu>
    </>
  );
});
