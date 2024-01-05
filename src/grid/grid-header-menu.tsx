import React, { useCallback } from "react";
import {
  ArrowNavigation,
  Badge,
  Box,
  ClickAwayListener,
  Divider,
  FocusTrap,
  Input,
  MenuContent,
  MenuItem,
  Popper,
  PopperPlacement,
  useClassNames,
} from "../core";

import { MaterialIcon } from "../icons/material-icon";
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
    column?: TYPES.GridColumn,
  ) => void;
  onColumnDrop?: DropHandler;
  onColumnGroupRemove?: (
    e: React.SyntheticEvent,
    group: TYPES.GridGroup,
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
    [name, title],
  );
  return (
    <GridDragElement
      className={styles.groupTagWrapper}
      column={data}
      onDrop={onDrop}
    >
      <Badge className={styles.groupTag} bg="primary">
        <label className={styles.groupTagTitle}>{data.title}</label>
        <Box
          as="span"
          d="flex"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove && onRemove(e, data);
          }}
        >
          <MaterialIcon icon="close" fontSize={20} />
        </Box>
      </Badge>
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

  const showMenu = useCallback(() => setColumnOptions(true), []);
  const hideMenu = useCallback(() => setColumnOptions(false), []);
  const placement = `bottom-${rtl ? "start" : "end"}` as PopperPlacement;

  return (
    <>
      <Box
        ref={setColumnOptionsTarget}
        className={styles.columnOptions}
        onClick={showMenu}
      >
        <MaterialIcon icon="more_vert" />
      </Box>
      <Popper
        className={classNames("table-popover", styles.columnOptionsMenu)}
        placement={placement}
        target={columnOptionsTarget}
        open={showColumnOptions}
      >
        <ClickAwayListener onClickAway={hideMenu}>
          <Box d="flex" flexDirection="column">
            <FocusTrap enabled={showColumnOptions}>
              <ArrowNavigation selector="auto-vertical">
                <MenuContent
                  show
                  border={false}
                  placement={placement}
                  className={styles.columnOptionsMenuColumns}
                >
                  {columns
                    .filter((c) => c.title?.trim() && c.hidden !== true)
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
                        <CustomMenuItem
                          key={column.id ?? column.name}
                          onClick={toggle}
                        >
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
                </MenuContent>
              </ArrowNavigation>
            </FocusTrap>
            {onColumnDrop && (
              <Box>
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
                      <Box className={styles.groupPlaceholder}>
                        {t("Groups")}
                      </Box>
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
              </Box>
            )}
            {onColumnCustomize && (
              <Box>
                <Divider aria-disabled="true" />
                <CustomMenuItem
                  onClick={(e: React.SyntheticEvent) => {
                    onColumnCustomize(e);
                    hideMenu();
                  }}
                >
                  <Box as="span" m={1} mb={2} ms={2}>
                    {t("Customize...")}
                  </Box>
                </CustomMenuItem>
              </Box>
            )}
          </Box>
        </ClickAwayListener>
      </Popper>
    </>
  );
});
