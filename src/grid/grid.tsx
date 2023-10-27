import React, { useMemo } from "react";
import { Box, useClassNames, useRefs } from "../core";
import { GridBody } from "./grid-body";
import { GridDNDColumn } from "./grid-dnd-row";
import { GridFooter } from "./grid-footer";
import { GridHeader } from "./grid-header";
import styles from "./grid.module.scss";
import { TranslateProvider } from "./translate";
import * as TYPES from "./types";
import {
  ROW_TYPE,
  getColumnWidth,
  getRows,
  isRowCheck,
  isRowVisible,
  navigator,
  useRTL,
} from "./utils";

function debounce(func: () => void, timeout: number = 300) {
  let timer: any;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      //@ts-ignore
      func.apply(this, args);
    }, timeout);
  };
}

const isDefined = (val: any) => val !== undefined;
const isNull = (value: any) => !isDefined(value) || value === null;
const getColumns = (columns: TYPES.GridColumn[]) =>
  columns.filter((column) => column.visible !== false);

const getCssSelector = (str: string) => (str || "").replace(/\+/g, () => "\\+");

function restoreGridSelection(
  state: TYPES.GridState,
  oldRows: TYPES.GridRow[],
) {
  // restore selected cell/rows index
  let { selectedRows, selectedCell, rows } = state;

  function getRowNewIndex(oldIndex: number) {
    const key = oldRows[oldIndex]?.key;
    const ind = rows.findIndex((row) => row.key === key);
    return ind === -1 ? (oldRows.length ? null : oldIndex) : ind;
  }

  if (selectedRows) {
    selectedRows = selectedRows
      .map(getRowNewIndex)
      .filter((ind) => ind !== null) as number[];
  }
  if (selectedCell) {
    const [row, col] = selectedCell;
    const newInd = getRowNewIndex(row);
    selectedCell = newInd !== null ? [newInd as number, col] : newInd;
  }

  return { selectedCell, selectedRows };
}

export const Grid = React.forwardRef<HTMLDivElement, TYPES.GridProps>(
  (props, ref) => {
    const containerRef = React.useRef<any>();
    const refs = React.useRef<any>({});

    const { className, state, setState, columns, records } = props;
    const {
      editable,
      sortType,
      aggregationType = "group",
      selectionType = "multiple",
    } = props;
    const {
      allowSelection,
      allowCellFocus = true,
      allowSorting,
      allowSearch,
      allowGrouping,
      allowColumnResize,
      allowColumnOptions,
      allowCheckboxSelection,
      allowCellSelection,
      allowColumnCustomize,
      allowColumnHide,
      allowRowReorder,
      stickyHeader = true,
      stickyFooter = true,
      labels,
    } = props;
    const isRTL = useRTL();

    const {
      onRowClick,
      onRowDoubleClick,
      onRowReorder,
      onRowSelectionChange,
      onCellClick,
      onRecordAdd,
      onRecordEdit,
      onRecordSave,
      onRecordDiscard,
      onColumnCustomize,
    } = props;

    const {
      cellRenderer,
      rowRenderer,
      headerRowRenderer,
      footerRowRenderer,
      rowGroupHeaderRenderer,
      rowGroupFooterRenderer,
      editRowRenderer,
      editRowColumnRenderer,
      searchRowRenderer,
      searchColumnRenderer,
    } = props;

    const handleRef = useRefs(containerRef, ref);
    const totalRows = state.rows.length;

    const getContainerWidth = React.useCallback(() => {
      const container = containerRef.current;
      if (container) {
        const vScrollbarWidth = container.offsetWidth - container.clientWidth;
        return container.getBoundingClientRect().width - vScrollbarWidth;
      }
      return 0;
    }, []);

    // auto size columns
    const sizingColumns = React.useCallback(() => {
      setState((state) => {
        const columns = [...state.columns];
        if (!columns.length) return;
        if (
          allowCheckboxSelection &&
          !columns.find((col) => col.name === "__select__")
        ) {
          columns.unshift({
            name: "__select__",
            title: "",
            type: "row-checked",
            computed: true,
            editable: false,
            sortable: false,
            searchable: false,
            width: 32,
          });
        }
        if (
          allowRowReorder &&
          !columns.find((col) => col.name === "__reorder__")
        ) {
          columns.push({
            name: "__reorder__",
            width: 32,
            computed: true,
            title: "",
            editable: false,
            sortable: false,
            searchable: false,
            renderer: GridDNDColumn,
          });
        }

        const borderWidth = 1;
        const totalWidth = getContainerWidth() - borderWidth * 2;
        if (totalWidth > 0) {
          const displayColumns = getColumns(columns);
          const computedColumns = displayColumns.filter((col) => col.computed);
          const unComputedColumns = displayColumns.filter(
            (col) => !col.computed,
          );
          const remainWidth =
            totalWidth -
            computedColumns.reduce(
              (total, col) =>
                total +
                Math.max(
                  parseFloat(`${col.width || 0}`),
                  parseFloat(`${col.minWidth || 0}`),
                ),
              0,
            );
          const colWidth = remainWidth / unComputedColumns.length;

          state.columns = columns.map((col) => {
            if (col.computed) return col;
            return {
              ...col,
              width: getColumnWidth(col, colWidth, true),
            };
          });
        }
      });
    }, [allowCheckboxSelection, allowRowReorder, getContainerWidth, setState]);

    // handle column sorting
    const handleSort = React.useCallback(
      (
        event: any,
        { name }: TYPES.GridColumn,
        index?: number,
        sortOrder?: "asc" | "desc",
      ) => {
        const newSort = { name, order: sortOrder || "asc" };
        const { shiftKey } = event;

        setState((data) => {
          // multiple column sort with shift key press
          !data.orderBy && (data.orderBy = []);
          const sortIndex = data.orderBy.findIndex((x) => x.name === name);
          if (sortIndex > -1) {
            newSort.order =
              sortOrder ||
              (data.orderBy[sortIndex].order === "asc" ? "desc" : "asc");
          }
          if (shiftKey) {
            if (sortIndex > -1) {
              data.orderBy[sortIndex] = newSort;
            } else {
              data.orderBy.push(newSort);
            }
          } else {
            // simple sort
            data.orderBy = [newSort];
          }
        });
      },
      [setState],
    );

    // handle rows check/uncheck all
    const handleCheckAll = React.useCallback(
      function onCheckAll(checked: boolean) {
        setState((data) => {
          data.selectedRows = checked
            ? data.rows.reduce(
                (selected, row, i) =>
                  selected.concat(
                    (row.type === ROW_TYPE.ROW ? [i] : []) as any,
                  ),
                [],
              )
            : null;
        });
      },
      [setState],
    );

    const handleRowStateChange = React.useCallback(
      function handleRowStateChange(
        row: TYPES.GridRow,
        state?: "open" | "close",
      ) {
        if (isDefined(row)) {
          const { key } = row;
          return setState((draft) => {
            const row = draft.rows.find(($row) => $row.key === key);
            row &&
              (row.state = state || (row.state === "open" ? "close" : "open"));
          });
        }
      },
      [setState],
    );

    // handle group row toggle, row selection
    const handleRowClick = React.useCallback(
      async (
        e: any,
        row: TYPES.GridRow,
        rowIndex: number,
        cellIndex: number | null = null,
        cell?: TYPES.GridColumn,
      ) => {
        const isSelectBox = e.key === "Enter" || cell?.type === "row-checked";

        // toggle group row
        if (row.type === "group-row") {
          const { key } = row;
          return setState((draft) => {
            const row = draft.rows.find(($row) => $row.key === key);
            row && (row.state = row.state === "open" ? "close" : "open");
          });
        }

        onRowClick && onRowClick(e, row, rowIndex);
        if (!isSelectBox && editable && !e.ctrlKey && !e.shiftKey) {
          if (onRecordEdit) {
            if (cell?.editable !== false) {
              e.preventDefault();
            }
            const result = await onRecordEdit(
              row,
              rowIndex,
              cell,
              cellIndex || -1,
            );
            if (result === null) {
              return (
                (cellIndex ?? 0) >= 0 &&
                setState((draft) => {
                  draft.selectedCell = [rowIndex, cellIndex!];
                  draft.selectedRows = [rowIndex];
                })
              );
            }
          }
          return setState((draft) => {
            draft.selectedCell = null;
            draft.selectedRows = [rowIndex];
            draft.editRow = [rowIndex, cellIndex];
          });
        }

        if (!allowSelection) return;
        if (row.type === ROW_TYPE.ROW) {
          const isMultiple = selectionType === "multiple";
          const withShift = isMultiple && e.shiftKey;
          const withControl = e.ctrlKey || isSelectBox;

          setState((draft) => {
            if (draft.editRow) return;

            // handle shift (except combined with ctrl) selection
            const rows = draft.selectedRows || [];
            let _selectedRows: any = [...rows];
            let _selectedCell: any = [...(draft.selectedCell || [])];
            let _selectedCols: any = [...(draft.selectedCols || [])];
            const dataRowIds = draft.rows.map((x) => x.record.id);
            if (!withControl && withShift) {
              const endIndex = refs.current.lastSelectionWithShiftKey
                ? 0
                : rows.length - 1;
              const startIndex = !isDefined(rows[endIndex])
                ? rowIndex
                : rows[endIndex];
              const isUpwards = startIndex > rowIndex;
              const selectedRows = dataRowIds
                .map((x, i) =>
                  (
                    isUpwards
                      ? i >= rowIndex && i <= startIndex
                      : i >= startIndex && i <= rowIndex
                  )
                    ? i
                    : null,
                )
                .filter(
                  (x) =>
                    x !== null &&
                    draft.rows[x].type === ROW_TYPE.ROW &&
                    isRowVisible(draft.rows, draft.rows[x]),
                );
              _selectedRows = isUpwards ? selectedRows.reverse() : selectedRows;
            }

            // handle control + selection
            if (withControl) {
              const ind = _selectedRows.indexOf(rowIndex);
              if (ind === -1) {
                _selectedRows.push(rowIndex);
              } else {
                !isSelectBox && (cellIndex = null);
                _selectedRows.splice(ind, 1);
              }
            }

            // row selection with cell click
            if (allowCellSelection) {
              _selectedCell = cellIndex !== null ? [rowIndex, cellIndex] : [];
            }

            // if no shift/control operation performed
            if (!withShift && !withControl) {
              _selectedRows = [rowIndex];
            } else if (!isMultiple) {
              _selectedRows = draft.selectedRows?.includes(rowIndex)
                ? []
                : [rowIndex];
            }

            if (_selectedCols.length && _selectedRows.length) {
              _selectedCols = null;
            }

            // deselect only selected row, so to blur focus from container
            if (_selectedRows.length === 0 && !isSelectBox) {
              _selectedCell = null;
              containerRef.current && containerRef.current.blur();
            }

            function assignArrayValue(
              key: "selectedCell" | "selectedCols" | "selectedRows",
              val: any,
            ) {
              if ((val || []).length === 0) {
                draft[key] = null;
              } else if (draft) {
                !draft[key] && (draft[key] = []);
                val.forEach((n: number, i: number) => {
                  (draft[key] as any)[i] = n;
                });
                (draft[key] as any).length = val.length;
              }
            }
            assignArrayValue("selectedCell", _selectedCell);
            assignArrayValue("selectedCols", _selectedCols);
            assignArrayValue("selectedRows", _selectedRows);
          });

          refs.current.lastSelectionWithShiftKey = withShift;
          // isSelectBox && focus();
        }
      },
      [
        allowSelection,
        allowCellSelection,
        selectionType,
        editable,
        onRecordEdit,
        onRowClick,
        setState,
      ],
    );

    const showHideAddNewLine = React.useCallback((hide = true) => {
      const container = containerRef.current;
      const addElement =
        container && container.querySelector(`.${styles.addNewText}`);
      if (addElement) {
        addElement.style.visibility = hide ? "hidden" : null;
      }
    }, []);

    const handleRowMove = React.useCallback(
      (dragRow: TYPES.GridRow, hoverRow: TYPES.GridRow) => {
        onRowReorder && onRowReorder(dragRow, hoverRow);
        return setState((draft) => {
          const { rows } = draft;
          const oldRows = [...rows];

          const dragIndex = rows.findIndex((row) => row.key === dragRow.key);
          const [dragColumn] = rows.splice(dragIndex, 1);

          const hoverIndex = rows.findIndex((row) => row.key === hoverRow.key);
          rows.splice(
            hoverIndex + (dragIndex <= hoverIndex ? 1 : 0),
            0,
            dragColumn,
          );

          const { selectedCell, selectedRows } = restoreGridSelection(
            draft,
            oldRows,
          );
          draft.selectedCell = selectedCell;
          draft.selectedRows = selectedRows;
        });
      },
      [onRowReorder, setState],
    );

    const handleColumnResizeStart = React.useCallback(
      function handleColumnResizeStart(
        e: React.DragEvent<HTMLElement>,
        column: TYPES.GridColumn,
      ) {
        const ctx = (e.target as HTMLElement).cloneNode(true) as HTMLElement;
        ctx.style.display = "none";
        e.dataTransfer.setDragImage(ctx, 0, 0);

        const { width = 0 } = column;
        const { clientX, clientY } = e;
        const container = containerRef.current;
        const event = {
          clientX,
          clientY,
          x: clientX,
          y: clientY,
          current: width,
          unsubscribe: () => {},
        };

        refs.current.style = document.createElement("style");
        refs.current.event = event;
        const element = e.target as HTMLElement;
        if (element) {
          // firefox support
          function updateEvent(e: DragEvent) {
            event.clientX = e.clientX;
            event.clientY = e.clientY;
          }
          document.addEventListener("dragover", updateEvent);
          event.unsubscribe = () =>
            document.removeEventListener("dragover", updateEvent);
        }
        const body = container.querySelector(getCssSelector(`.${styles.body}`));
        body &&
          (body.style.minWidth = `${body.getBoundingClientRect().width}px`);

        container.classList.add(styles.resizingColumns);
        container.appendChild(refs.current.style);
      },
      [],
    );

    const handleColumnResize = React.useCallback(
      function handleColumnResize(
        e: React.DragEvent<HTMLElement>,
        column: TYPES.GridColumn,
        index: number,
      ) {
        const dataTransfer = Object.assign({}, refs.current.event);
        const clientX =
          (e.clientX > 0 ? e.clientX : 0) || (dataTransfer || {}).clientX || 0;
        if (!dataTransfer || clientX <= 0) return;

        e.preventDefault();
        e.stopPropagation();

        const diff = dataTransfer.x - clientX;
        const moved = isRTL ? -diff : diff;
        const width = getColumnWidth(
          column,
          dataTransfer.current - moved,
          true,
        );
        refs.current.style.innerHTML = `
          .${styles.resizingColumns} .${getCssSelector(
            styles.column,
          )}:nth-child(${index + 1}) {
            width: ${width}px !important;
            min-width: ${width}px !important;
          }
        `;
        refs.current.event.width = width;
      },
      [isRTL],
    );

    const handleColumnResizeEnd = React.useCallback(
      function handleColumnResizeEnd(
        e: React.DragEvent<HTMLElement>,
        column: TYPES.GridColumn,
      ) {
        const dataTransfer = refs.current.event;
        if (!dataTransfer.width) return;

        const container = containerRef.current;
        const width = getColumnWidth(column, dataTransfer.width, true);
        // set column width in state
        setState((draft) => {
          const col = draft.columns.find((c) => c.name === column.name);
          if (col) {
            col.width = width;
            col.computed = true;
          }
        });
        sizingColumns();

        // clear styles/dataTransfer
        const body = container.querySelector(getCssSelector(`.${styles.body}`));
        body.style.minWidth = null;

        container.classList.remove(styles.resizingColumns);
        container.removeChild(refs.current.style);
        refs.current.event?.unsubscribe?.();
        refs.current.event = {};
      },
      [setState, sizingColumns],
    );

    const handleColumnHide = React.useCallback(
      (e: React.SyntheticEvent, column: TYPES.GridColumn) => {
        setState((draft) => {
          const columnState = draft.columns.find((col) =>
            column.id ? column.id === col.id : col.name === column.name,
          ) as TYPES.GridColumn;
          columnState && (columnState.visible = false);
        });
        sizingColumns();
      },
      [setState, sizingColumns],
    );

    const handleColumnShow = React.useCallback(
      (e: React.SyntheticEvent, column: TYPES.GridColumn) => {
        setState((draft) => {
          const columnState = draft.columns.find((col) =>
            column.id ? column.id === col.id : col.name === column.name,
          ) as TYPES.GridColumn;
          columnState && (columnState.visible = true);
        });
        sizingColumns();
      },
      [setState, sizingColumns],
    );

    const handleGroupColumnDrop = React.useCallback(
      function handleColumnDrop(
        dest: TYPES.DropObject,
        target: TYPES.DropObject,
      ) {
        if (!dest?.name) return;

        const isColumnReorder =
          dest?.name && !dest?.$group && target?.name && !target?.$group;

        if (isColumnReorder) {
          return setState((draft) => {
            const { columns } = draft;
            const dragIndex = columns.findIndex((c) => c.name === dest.name);
            const [dragColumn] = columns.splice(dragIndex, 1);
            const hoverIndex = columns.findIndex((c) => c.name === target.name);

            columns.splice(
              hoverIndex + (dragIndex <= hoverIndex ? 1 : 0),
              0,
              dragColumn,
            );
          });
        }

        setState((data) => {
          !data.groupBy && (data.groupBy = []);

          function check(column: { name: string }) {
            return (
              column?.name &&
              (data.groupBy || []).find((x) => x.name === column?.name)
            );
          }

          const isDestExist = check(dest);
          const isTargetExist = check(target);
          // new group column added
          let group = {
            name: dest.name,
          };

          if (isDestExist && isTargetExist) {
            // reorder
            const sourceIndex = data.groupBy.findIndex(
              (g) => g.name === dest.name,
            );
            let targetIndex = data.groupBy.findIndex(
              (g) => g.name === target.name,
            );
            if (sourceIndex > -1) {
              [group] = data.groupBy.splice(sourceIndex, 1);
            }
            if (targetIndex === -1) {
              targetIndex = data.groupBy.length;
            }
            data.groupBy.splice(targetIndex, 0, group);
          } else if (!isDestExist) {
            data.groupBy.push(group);
          }

          data.selectedCell = null;
        });
      },
      [setState],
    );

    const handleGroupColumnAdd = React.useCallback(
      (e: React.SyntheticEvent, group: TYPES.GridGroup) => {
        setState((data) => {
          const groupBy = (data.groupBy = data.groupBy || []);
          if (!groupBy.find((g) => g.name === group.name)) {
            groupBy.push(group);
          }
          data.selectedCell = null;
        });
      },
      [setState],
    );

    const handleGroupColumnRemove = React.useCallback(
      (e: React.SyntheticEvent, group: TYPES.GridGroup) => {
        setState((data) => {
          const groupBy = data.groupBy || [];
          const index = groupBy.findIndex((g) => g.name === group.name);
          if (index > -1) {
            groupBy.splice(index, 1);
          }
          data.selectedCell = null;
        });
      },
      [setState],
    );

    const handleRecordComplete = React.useCallback(
      (
        row: any,
        rowIndex: number,
        columnIndex: number,
        discarded = false,
        reset = true,
      ) => {
        setState((draft) => {
          if (draft.editRow && reset) {
            let [rowIndex, cellIndex] = draft.editRow;
            if (discarded && !row.id) {
              rowIndex--;
            }
            draft.selectedCell = [rowIndex, columnIndex || cellIndex];
          }
          draft.editRow = null;
        });
      },
      [setState],
    );

    const handleRecordAdd = React.useCallback(
      async (checkEdit = true) => {
        // check any current edit row
        if (checkEdit && onRecordEdit) {
          const result = await onRecordEdit({});
          // if result is not, current edit record is invalidate
          if (result === null) return;
        }
        // call event on record add
        const result: any = onRecordAdd && (await onRecordAdd());
        if (result === true) {
          return;
        }
        setState((draft) => {
          if (draft.editRow) {
            const [rowIndex] = draft.editRow;
            draft.editRow = [rowIndex + 1, 1];
          } else {
            draft.editRow = [draft.rows.length, 1];
          }
          draft.selectedRows = null;
          draft.selectedCell = null;
        });
      },
      [onRecordAdd, onRecordEdit, setState],
    );

    const handleRecordUpdate = React.useCallback(
      function handleRecordUpdate(rowIndex: number, values: any) {
        setState((draft) => {
          const row = draft.rows[rowIndex];
          if (row && row.record && row.record.id) {
            if (rowIndex > -1) {
              draft.rows[rowIndex].record = {
                ...draft.rows[rowIndex].record,
                ...values,
              };
            }
          }
        });
      },
      [setState],
    );

    const handleRecordDiscard = React.useCallback(
      (row: TYPES.GridRow, rowIndex: number, columnIndex: number) => {
        // reset record state
        handleRecordComplete(row, rowIndex, columnIndex, true);
        onRecordDiscard && onRecordDiscard(row, rowIndex, 0);
      },
      [handleRecordComplete, onRecordDiscard],
    );

    const handleRecordSave = React.useCallback(
      async (
        row: any,
        rowIndex: number,
        columnIndex: number,
        dirty?: boolean,
        saveFromEdit?: boolean,
      ) => {
        // is last record save, then add new record
        const isLast = !saveFromEdit && rowIndex === totalRows - 1;
        let result: any = row;
        if (dirty && onRecordSave) {
          result = await onRecordSave(row, rowIndex, 0);
        }
        // record is validated
        if (result) {
          if (isLast && onRecordAdd) {
            // add new record
            handleRecordAdd(false);
          } else if (dirty) {
            // complete record edit state
            handleRecordComplete(
              row,
              rowIndex,
              columnIndex,
              false,
              !saveFromEdit,
            );
          } else if (!dirty) {
            handleRecordDiscard(row, rowIndex, columnIndex);
          }
        }
        return result;
      },
      [
        totalRows,
        handleRecordComplete,
        handleRecordAdd,
        handleRecordDiscard,
        onRecordAdd,
        onRecordSave,
      ],
    );

    const handleNavigation = (event: React.KeyboardEvent<HTMLElement>) => {
      const { ctrlKey, shiftKey } = event;
      const key = (() => {
        const { key } = event;
        if (isRTL) {
          if (key === "ArrowRight") return "ArrowLeft";
          if (key === "ArrowLeft") return "ArrowRight";
        }
        return key;
      })();
      if (
        state.editRow ||
        event.isPropagationStopped() ||
        event.defaultPrevented ||
        (event.target &&
          (event.target as HTMLElement).classList.contains(
            styles.focusElement,
          )) ||
        ctrlKey ||
        ![
          "Enter",
          "Tab",
          "ArrowRight",
          "ArrowLeft",
          "ArrowUp",
          "ArrowDown",
        ].includes(key)
      )
        return;
      event.preventDefault();

      const { rows, groupBy } = state;
      const columns = getColumns(state.columns);
      const selectedCell = state.selectedCell || [];
      const selectedRows = state.selectedRows || [];
      const selectedCols = state.selectedCols || [];
      const isMultipleSelection = selectionType === "multiple";
      const data = rows.map((x) => x.record.id);
      let [row, col] = selectedCell.length ? selectedCell : [];
      let isHeaderCell = selectedCols.length > 0;

      if (key === "Enter") {
        const isCheckboxCell = columns[col] && isRowCheck(columns[col]);
        if (isHeaderCell) {
          if (isCheckboxCell) {
            //@ts-ignore
            const [checkbox] = (
              event.target as HTMLElement
            ).getElementsByTagName("input");
            handleCheckAll(!checkbox.checked);
          } else {
            handleSort(event, columns[col], col);
          }
          return;
        } else if (rows[row] && rows[row].type === ROW_TYPE.GROUP_ROW) {
          return handleRowStateChange(rows[row]);
        } else if (isCheckboxCell) {
          return handleRowClick(event, rows[row], row, col);
        } else if (rows[row] && rows[row].type === ROW_TYPE.ROW) {
          if (props.editRowRenderer) {
            return setState((data) => {
              data.editRow = [row, col];
            });
          }
        }
      }

      const isTabKey = key === "Tab";
      const isEditMode = isTabKey;
      //@ts-ignore
      [row, col] = selectedCell.length ? selectedCell : [];
      // first focus attempt with tab in editable mode (open group)
      if (isEditMode && groupBy && groupBy.length) {
        isNull(row) && (row = 0);
        isNull(col) && (col = 0);
      }
      if (isHeaderCell) {
        row = 0;
        [col] = selectedCols;
      }

      if (!isNull(row) && !isNull(col)) {
        const maxRow = data.length - 1;
        const maxCol = columns.length - 1;
        const isGroupCell =
          !isHeaderCell && rows[row] && rows[row].type === ROW_TYPE.GROUP_ROW;
        const isFirstColumn = col === 0;
        const isLastColumn = col === maxCol;
        const findRow = () => rows[row];
        const Helper = navigator(rows, {
          maxRow,
          isGroupCell,
          updateRowState: handleRowStateChange,
        });
        const moveToStart = () => (col = 0);
        const moveToEnd = () => (col = maxCol);
        const moveUp = () => {
          const lastRow = row;
          if (!isHeaderCell) {
            row = Math.max(
              0,
              Helper[isEditMode ? "findAndShowPrevRows" : "findLastVisibleRow"](
                row,
              ),
            );
          }
          return row !== lastRow;
        };
        const moveDown = () => {
          const lastRow = row;
          if (!isHeaderCell) {
            row = Math.min(
              maxRow,
              Helper[isEditMode ? "findAndShowNextRows" : "findNextVisibleRow"](
                row,
              ),
            );
          }
          return row !== lastRow;
        };
        const moveLeft = () => {
          if (isHeaderCell && isFirstColumn) {
            return moveToEnd();
          }
          if (
            isGroupCell &&
            key === "ArrowLeft" &&
            findRow().state === "open"
          ) {
            return handleRowStateChange(rows[row], "close");
          }
          if (isGroupCell || isFirstColumn) {
            return moveUp() && moveToEnd();
          }
          col = Math.max(0, col - 1);
        };
        const moveRight = () => {
          if (isHeaderCell && isLastColumn) {
            return moveToStart();
          }
          if (
            isGroupCell &&
            key === "ArrowRight" &&
            findRow().state === "close"
          ) {
            return handleRowStateChange(rows[row], "open");
          }
          if (isGroupCell || isLastColumn) {
            return moveDown() && moveToStart();
          }
          col = Math.min(maxCol, col + 1);
        };

        const movement: any = {
          Tab: () => {
            if (isHeaderCell) {
              row = 0;
            } else if (shiftKey) {
              if (isFirstColumn) {
                moveUp() && moveToEnd();
              } else {
                moveLeft();
              }
            } else {
              if (isLastColumn) {
                moveDown() && moveToStart();
              } else {
                moveRight();
              }
            }
          },
          ArrowUp: moveUp,
          ArrowDown: moveDown,
          ArrowLeft: moveLeft,
          ArrowRight: moveRight,
          Enter: moveDown,
        };

        movement[key] && movement[key]();
      } else {
        [row, col] = [0, 0];
      }

      setState((data) => {
        const checkAndAssign = (
          key: "selectedCell" | "selectedRows" | "selectedCols",
          value: any,
        ) => {
          const toString = (obj: any) => JSON.stringify(obj);
          if (toString(data[key]) !== toString(value)) {
            data[key] = value;
          }
        };

        if (isHeaderCell && !isTabKey) {
          checkAndAssign("selectedCols", [col]);
        } else {
          if ((selectedCols || []).length) {
            data.selectedCols = null;
          }
          checkAndAssign("selectedCell", [row, col]);

          if (selectedRows && (selectedRows || []).length) {
            const rowIndex = row;
            let newRows = selectedRows.slice();
            if (isMultipleSelection && shiftKey && !isTabKey) {
              const ind = selectedRows.indexOf(rowIndex);
              if (ind > -1) {
                newRows.splice(ind + 1, 1);
              } else if (rows[rowIndex].type === ROW_TYPE.ROW) {
                newRows.push(rowIndex);
              }
            } else {
              newRows = [rowIndex];
            }
            checkAndAssign("selectedRows", newRows);
          }
        }
      });
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      const header =
        container &&
        container.querySelector(getCssSelector(`.${styles.header}`));
      if (header && stickyHeader) {
        if (!refs.current.stickOffset) {
          refs.current.stickOffset = header.offsetTop + header.offsetHeight;
        }
        const isStick = e.currentTarget.scrollTop > refs.current.stickOffset;
        if (isStick) {
          header.classList.add(styles.shadow);
        } else {
          header.classList.remove(styles.shadow);
        }
      }
    };

    const scrollToCell = React.useCallback(
      function scrollToCell([row, col]: number[], focusGrid = true) {
        if (!allowCellFocus || isNull(row) || isNull(col)) return;
        const container = containerRef.current;
        const rowNode =
          container &&
          container.querySelector(
            getCssSelector(`.${styles.body} .row-${row}`),
          );
        const getCellNode = () => {
          if (!rowNode) return;
          let selector = `.${styles.column}:nth-child(${col + 1})`;
          if (rowNode.classList.contains(styles.groupRow)) {
            return rowNode;
          }
          return rowNode.querySelector(getCssSelector(selector));
        };
        const selectedCell = refs.current.selectedCell || { row };
        const isUpwards = stickyHeader && selectedCell.row > row;
        const isDownwards = stickyFooter && selectedCell.row < row;

        let cellNode = getCellNode();
        if (cellNode) {
          cellNode.focus({ preventScroll: true });
          const { scrollLeft, scrollTop } = container;
          const {
            offsetHeight: contentHeight,
            offsetWidth: contentWidth,
            clientHeight,
            clientWidth,
          } = container;
          const horizontalScrollbarSize = contentHeight - clientHeight;
          const verticalScrollbarSize = contentWidth - clientWidth;
          const { offsetLeft, offsetWidth, offsetHeight } = cellNode;

          const offsetTop =
            cellNode.offsetTop -
            (isUpwards
              ? (
                  container.querySelector(
                    getCssSelector(`.${styles.header}`),
                  ) || {}
                ).clientHeight
              : isDownwards
              ? -(
                  (
                    container.querySelector(
                      getCssSelector(`.${styles.footer}`),
                    ) || {}
                  ).clientHeight || 0
                )
              : 0);
          const cellYTotalOffset =
            offsetLeft + offsetWidth + verticalScrollbarSize;
          const cellXTotalOffset = offsetTop + offsetHeight;

          let coords: any = {};
          if (cellYTotalOffset > scrollLeft + contentWidth) {
            coords.scrollLeft =
              offsetWidth > contentWidth ? 0 : cellYTotalOffset - contentWidth;
          } else if (scrollLeft > offsetLeft) {
            coords.scrollLeft = offsetLeft;
          }
          if (
            cellXTotalOffset + horizontalScrollbarSize >
            scrollTop + contentHeight
          ) {
            coords.scrollTop =
              cellXTotalOffset - contentHeight + horizontalScrollbarSize;
          } else if (scrollTop >= offsetTop) {
            coords.scrollTop = offsetTop;
          }

          coords.scrollLeft >= 0 && (container.scrollLeft = coords.scrollLeft);
          coords.scrollTop >= 0 && (container.scrollTop = coords.scrollTop);
        }
        refs.current.selectedCell = { row, col };
        focusGrid && container && container.focus();
      },
      [allowCellFocus, stickyHeader, stickyFooter],
    );

    const $orderBy = sortType === "state" ? state.orderBy : null;
    React.useEffect(() => {
      // generate computed rows from records
      setState((draft) => {
        const newRows = getRows({
          records,
          columns,
          orderBy: $orderBy,
          groupBy: state.groupBy,
          rows: [],
        });

        return {
          ...draft,
          ...restoreGridSelection({ ...draft, rows: newRows }, draft.rows),
          rows: newRows,
        };
      });
    }, [setState, records, columns, sortType, $orderBy, state.groupBy]);

    React.useEffect(() => {
      if (!containerRef.current) return;
      let cancelled = false;
      let lastWidth = getContainerWidth();

      // observe resize for grid container
      const observeGrid = new ResizeObserver(
        debounce(() => {
          if (cancelled) return;
          const currentWidth = getContainerWidth();
          if (currentWidth !== lastWidth) {
            lastWidth = currentWidth;
            sizingColumns();
          }
        }, 300),
      );
      observeGrid.observe(containerRef.current);
      return () => {
        cancelled = true;
        observeGrid.disconnect();
      };
    }, [getContainerWidth, sizingColumns]);

    React.useEffect(() => {
      // exclude hide columns
      setState((draft) => {
        draft.columns = [...columns];
      });
      sizingColumns();
    }, [setState, columns, sizingColumns]);

    React.useEffect(() => {
      if (state.selectedCell) {
        scrollToCell(state.selectedCell);
      } else if (state.selectedRows?.length === 1) {
        const [ind] = state.selectedRows;
        scrollToCell([ind, 0], false);
      }
    }, [state.selectedCell, state.selectedRows, scrollToCell]);

    const noSelection = useMemo(() => [], []);
    React.useEffect(() => {
      onRowSelectionChange?.(state.selectedRows ?? noSelection);
    }, [noSelection, onRowSelectionChange, state.selectedRows]);

    const hasAggregation = React.useMemo(
      () => columns.some((column) => column.aggregate),
      [columns],
    );

    const displayColumns = React.useMemo(
      () => getColumns(state.columns),
      [state.columns],
    );
    const isEditMode = Boolean(state.editRow);
    const checkType = React.useMemo(() => {
      if ((state.selectedRows || []).length === 0) {
        return "unchecked";
      }
      if (
        state.rows.filter((row) => row.type === ROW_TYPE.ROW).length ===
        state.selectedRows?.length
      ) {
        return "checked";
      }
      return "indeterminate";
    }, [state.rows, state.selectedRows]);

    const noColumns = React.useMemo(() => {
      return (
        displayColumns.every(
          (col) =>
            (col as any).action ||
            col.type === "row-checked" ||
            (col.width && col.width < 50),
        ) || displayColumns.length === 0
      );
    }, [displayColumns]);

    const hasFooter = hasAggregation && aggregationType === "all";
    const classNames = useClassNames();

    return (
      <TranslateProvider labels={labels}>
        <Box
          ref={handleRef}
          className={classNames("table-grid", styles.container, className, {
            [styles["no-records"]]:
              records.length === 0 && state?.rows?.length === 0,
            [styles["no-columns"]]: noColumns,
            [styles["has-add-new"]]: Boolean(props.addNewText),
            [styles["has-footer"]]: hasFooter,
            [styles["rtl"]]: isRTL,
          })}
          {...(allowCellSelection
            ? { tabIndex: 0, onKeyDown: handleNavigation }
            : {})}
          onScroll={handleScroll}
        >
          <GridHeader
            className={classNames(styles.header, {
              [styles.sticky]: stickyHeader,
              [styles.options]: allowColumnOptions,
            })}
            groupBy={state.groupBy}
            orderBy={state.orderBy}
            columns={displayColumns}
            rowRenderer={headerRowRenderer}
            checkType={checkType}
            selectionType={selectionType}
            {...(allowColumnOptions ? { allColumns: state.columns } : {})}
            {...(allowSearch
              ? {
                  searchRowRenderer,
                  searchColumnRenderer,
                }
              : {})}
            {...(!isEditMode
              ? {
                  ...(allowColumnResize
                    ? {
                        onColumnResizeStart: handleColumnResizeStart,
                        onColumnResize: handleColumnResize,
                        onColumnResizeEnd: handleColumnResizeEnd,
                      }
                    : {}),
                  ...(allowSorting
                    ? {
                        onColumnClick: handleSort,
                      }
                    : {}),
                  ...(allowGrouping
                    ? {
                        onColumnDrop: handleGroupColumnDrop,
                        onColumnGroupAdd: handleGroupColumnAdd,
                        onColumnGroupRemove: handleGroupColumnRemove,
                      }
                    : {}),
                  ...(allowColumnCustomize ? { onColumnCustomize } : {}),
                  ...(allowColumnHide
                    ? {
                        onColumnShow: handleColumnShow,
                        onColumnHide: handleColumnHide,
                      }
                    : {}),
                  onCheckAll: handleCheckAll,
                }
              : {})}
          />
          <GridBody
            columns={displayColumns}
            rows={state.rows}
            editRow={state.editRow}
            selectedRows={state.selectedRows}
            selectedCell={state.selectedCell}
            selectionType={selectionType}
            noRecordsText={records.length === 0 ? props.noRecordsText : ""}
            addNewText={props.addNewText}
            {...{
              cellRenderer,
              rowRenderer,
              editRowRenderer,
              editRowColumnRenderer,
              rowGroupFooterRenderer,
              rowGroupHeaderRenderer,
            }}
            {...(editable
              ? {
                  editRowRenderer,
                  onRecordAdd: handleRecordAdd,
                  onRecordSave: handleRecordSave,
                  onRecordDiscard: handleRecordDiscard,
                }
              : {})}
            {...(allowRowReorder
              ? {
                  onRowMove: handleRowMove,
                  onRowMoveStart: showHideAddNewLine,
                }
              : {})}
            onCellClick={onCellClick}
            onRowClick={handleRowClick}
            onRowDoubleClick={onRowDoubleClick}
            onRecordUpdate={handleRecordUpdate}
          />
          {hasFooter && (
            <GridFooter
              className={classNames(styles.footer, {
                [styles.sticky]: stickyFooter,
              })}
              rowRenderer={footerRowRenderer}
              records={records}
              columns={displayColumns}
            />
          )}
        </Box>
      </TranslateProvider>
    );
  },
);
