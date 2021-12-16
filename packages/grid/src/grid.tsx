import React from 'react';
import produce from 'immer';
import { useRefs } from '@axelor-ui/core/hooks';
import { styleNames } from '@axelor-ui/core/styles';

import { GridGroup } from './grid-group';
import { GridHeader } from './grid-header';
import { GridBody } from './grid-body';
import { GridDNDColumn } from './grid-dnd-row';
import {
  GRID_CONFIG,
  ROW_TYPE,
  navigator,
  getRows,
  isRowVisible,
  isRowCheck,
} from './utils';
import * as TYPES from './types';
import styles from './grid.module.css';
import { GridFooter } from './grid-footer';

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
  columns.filter(column => column.visible !== false);

function restoreGridSelection(
  state: TYPES.GridState,
  oldRows: TYPES.GridRow[]
) {
  // restore selected cell/rows index
  let { selectedRows, selectedCell, rows } = state;

  function getRowNewIndex(oldIndex: number) {
    const key = oldRows[oldIndex].key;
    return rows.findIndex(row => row.key === key);
  }

  if (selectedRows) {
    selectedRows = selectedRows.map(getRowNewIndex);
  }
  if (selectedCell) {
    const [row, col] = selectedCell;
    selectedCell = [getRowNewIndex(row), col];
  }

  return { selectedCell, selectedRows };
}

export const Grid = React.forwardRef<HTMLDivElement, TYPES.GridProps>(
  (props, ref) => {
    const containerRef = React.useRef<any>();
    const refs = React.useRef<any>({});
    const { className, state, setState, columns, records } = props;
    const { editable, sortType, selectionType } = props;
    const {
      allowSelection,
      allowSorting,
      allowSearch,
      allowGrouping,
      allowColumnResize,
      allowCheckboxSelection,
      allowCellSelection,
      allowColumnCustomize,
      allowColumnHide,
      allowRowReorder,
      stickyHeader = true,
      stickyFooter = true,
    } = props;

    const {
      onRowClick,
      onRowDoubleClick,
      onRowReorder,
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

    const setMutableState = React.useCallback(
      (state: TYPES.GridState | TYPES.GridStateHandler) =>
        setState(produce(state as any)),
      [setState]
    );

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
      setMutableState(state => {
        const columns = [...state.columns];
        if (!columns.length) return;
        if (
          allowCheckboxSelection &&
          !columns.find(col => col.name === '__select__')
        ) {
          columns.unshift({
            name: '__select__',
            title: '',
            type: 'row-checked',
            computed: true,
            width: 30,
          });
        }
        if (
          allowRowReorder &&
          !columns.find(col => col.name === '__reorder__')
        ) {
          columns.push({
            name: '__reorder__',
            width: 30,
            computed: true,
            title: '',
            renderer: GridDNDColumn,
          });
        }

        const totalWidth = getContainerWidth();
        if (totalWidth > 0) {
          const displayColumns = getColumns(columns);
          const computedColumns = displayColumns.filter(col => col.computed);
          const unComputedColumns = displayColumns.filter(col => !col.computed);
          const remainWidth =
            totalWidth -
            computedColumns.reduce(
              (total, col) => total + parseFloat(`${col.width}`),
              0
            );
          const colWidth = remainWidth / unComputedColumns.length;

          state.columns = columns.map(col => {
            if (col.computed) return col;
            return {
              ...col,
              width: Math.max(GRID_CONFIG.COLUMN_MIN_WIDTH, colWidth),
            };
          });
        }
      });
    }, [
      allowCheckboxSelection,
      allowRowReorder,
      getContainerWidth,
      setMutableState,
    ]);

    // handle column sorting
    const handleSort = React.useCallback(
      (event, { name }, index?, sortOrder?: 'asc' | 'desc') => {
        const newSort = { name, order: sortOrder || 'asc' };
        const { shiftKey } = event;

        setMutableState(data => {
          // multiple column sort with shift key press
          !data.orderBy && (data.orderBy = []);
          const sortIndex = data.orderBy.findIndex(x => x.name === name);
          if (sortIndex > -1) {
            newSort.order =
              sortOrder ||
              (data.orderBy[sortIndex].order === 'asc' ? 'desc' : 'asc');
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
      [setMutableState]
    );

    // handle rows check/uncheck all
    const handleCheckAll = React.useCallback(
      function onCheckAll(checked: boolean) {
        setMutableState(data => {
          data.selectedRows = checked
            ? data.rows.reduce(
                (selected, row, i) =>
                  selected.concat(
                    (row.type === ROW_TYPE.ROW ? [i] : []) as any
                  ),
                []
              )
            : null;
        });
      },
      [setMutableState]
    );

    const handleRowStateChange = React.useCallback(
      function handleRowStateChange(row, state?: 'open' | 'close') {
        if (isDefined(row)) {
          const { key } = row;
          return setMutableState(draft => {
            const row = draft.rows.find($row => $row.key === key);
            row &&
              (row.state = state || (row.state === 'open' ? 'close' : 'open'));
          });
        }
      },
      [setState]
    );

    // handle group row toggle, row selection
    const handleRowClick = React.useCallback(
      async (e, row, rowIndex, cellIndex = null) => {
        const isSelectBox =
          e.key === 'Enter' ||
          ['checkbox', 'radio'].includes(e.target && e.target.type);

        // toggle group row
        if (row.type === 'group-row') {
          const { key } = row;
          return setMutableState(draft => {
            const row = draft.rows.find($row => $row.key === key);
            row && (row.state = row.state === 'open' ? 'close' : 'open');
          });
        }

        onRowClick && onRowClick(e, row, rowIndex);
        if (!isSelectBox && editable) {
          if (onRecordEdit) {
            const result = await onRecordEdit(row, rowIndex);
            if (result === null) {
              return;
            }
          }
          return setMutableState(draft => {
            draft.selectedCell = null;
            draft.selectedRows = [rowIndex];
            draft.editRow = [rowIndex, cellIndex];
          });
        }

        if (!allowSelection) return;
        if (row.type === ROW_TYPE.ROW) {
          const isMultiple = selectionType === 'multiple';
          const withShift = isMultiple && e.shiftKey;
          const withControl = e.ctrlKey || isSelectBox;

          setMutableState(draft => {
            if (draft.editRow) return;

            // handle shift (except combined with ctrl) selection
            const rows = draft.selectedRows || [];
            let _selectedRows: any = [...rows];
            let _selectedCell: any = [...(draft.selectedCell || [])];
            let _selectedCols: any = [...(draft.selectedCols || [])];
            const dataRowIds = draft.rows.map(x => x.record.id);
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
                    : null
                )
                .filter(
                  x =>
                    x !== null &&
                    draft.rows[x].type === ROW_TYPE.ROW &&
                    isRowVisible(draft.rows, draft.rows[x])
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
            if ((!withShift && !withControl) || !isMultiple) {
              _selectedRows = [rowIndex];
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
              key: 'selectedCell' | 'selectedCols' | 'selectedRows',
              val: any
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
            assignArrayValue('selectedCell', _selectedCell);
            assignArrayValue('selectedCols', _selectedCols);
            assignArrayValue('selectedRows', _selectedRows);
          });

          refs.current.lastSelectionWithShiftKey = withShift;
          // isSelectBox && focus();
        }
      },
      [editable, onRecordEdit, onRowClick, setMutableState]
    );

    const handleRowMove = React.useCallback(
      (dragRow, hoverRow, isStartRow) => {
        onRowReorder && onRowReorder(dragRow, hoverRow);
        return setMutableState(draft => {
          const { rows } = draft;
          const oldRows = [...rows];

          const dragIndex = rows.findIndex(row => row.key === dragRow.key);
          const [dragColumn] = rows.splice(dragIndex, 1);

          const hoverIndex = rows.findIndex(row => row.key === hoverRow.key);
          rows.splice(hoverIndex + (isStartRow ? 0 : 1), 0, dragColumn);

          const { selectedCell, selectedRows } = restoreGridSelection(
            draft,
            oldRows
          );
          draft.selectedCell = selectedCell;
          draft.selectedRows = selectedRows;
        });
      },
      [onRowReorder, setMutableState]
    );

    const handleColumnResizeStart = React.useCallback(
      function handleColumnResizeStart(e, column: TYPES.GridColumn) {
        const ctx = e.target.cloneNode(true);
        ctx.style.display = 'none';
        e.dataTransfer.setDragImage(ctx, 0, 0);

        const { width = 0 } = column;
        const { clientX, clientY } = e;
        const container = containerRef.current;

        refs.current.style = document.createElement('style');
        refs.current.event = {
          x: clientX,
          y: clientY,
          current: width,
        };
        const body = container.querySelector(`.${styles.body}`);
        body &&
          (body.style.minWidth = `${body.getBoundingClientRect().width}px`);

        container.classList.add(styles.resizingColumns);
        container.appendChild(refs.current.style);
      },
      []
    );

    const handleColumnResize = React.useCallback(function handleColumnResize(
      e,
      column,
      index
    ) {
      const dataTransfer = Object.assign({}, refs.current.event);
      const clientX = e.clientX || (dataTransfer || {}).clientX || 0;
      if (!dataTransfer || clientX <= 0) return;

      e.preventDefault();
      e.stopPropagation();

      const diff = dataTransfer.x - clientX;
      const moved = diff;
      const width = Math.max(
        GRID_CONFIG.COLUMN_MIN_WIDTH,
        dataTransfer.current - moved
      );
      refs.current.style.innerHTML = `
          .${styles.resizingColumns} .${styles.column}:nth-child(${index + 1}) {
            width: ${width}px !important;
            min-width: ${width}px !important;
          }
        `;
      refs.current.event.width = width;
    },
    []);

    const handleColumnResizeEnd = React.useCallback(
      function handleColumnResizeEnd(e, column) {
        const dataTransfer = refs.current.event;
        if (!dataTransfer.width) return;

        const container = containerRef.current;
        const width = Math.max(
          GRID_CONFIG.COLUMN_MIN_WIDTH,
          dataTransfer.width
        );
        // set column width in state
        setMutableState(draft => {
          const col = draft.columns.find(c => c.name === column.name);
          if (col) {
            col.width = width;
            col.computed = true;
          }
        });
        sizingColumns();

        // clear styles/dataTransfer
        const body = container.querySelector(`.${styles.body}`);
        body.style.minWidth = null;

        container.classList.remove(styles.resizingColumns);
        container.removeChild(refs.current.style);
        refs.current.event = {};
      },
      [setMutableState]
    );

    const handleColumnHide = React.useCallback(
      (e, column) => {
        setMutableState(draft => {
          const columnState = draft.columns.find(
            col => col.name === column.name
          ) as TYPES.GridColumn;
          columnState && (columnState.visible = false);
        });
        sizingColumns();
      },
      [setMutableState]
    );

    const handleColumnShow = React.useCallback(
      (e, column) => {
        setMutableState(draft => {
          const columnState = draft.columns.find(
            col => col.name === column.name
          ) as TYPES.GridColumn;
          columnState && (columnState.visible = true);
        });
        sizingColumns();
      },
      [setMutableState]
    );

    const handleGroupColumnDrop = React.useCallback(
      function handleColumnDrop(dest, target) {
        const isColumnReorder = dest.column && target.column;

        if (isColumnReorder) {
          return setMutableState(draft => {
            const { columns } = draft;
            const dragIndex = columns.findIndex(
              c => c.name === dest.column.name
            );
            const [dragColumn] = columns.splice(dragIndex, 1);

            const hoverIndex = columns.findIndex(
              c => c.name === target.column.name
            );
            columns.splice(hoverIndex, 0, dragColumn);
          });
        }

        setMutableState(data => {
          !data.groupBy && (data.groupBy = []);

          const isGroupExist = data.groupBy.find(
            x => x === (dest.column || dest.group).name
          );
          if ((dest.column || dest.group) && isGroupExist) return;

          // new group column added
          let group = {
            name: (dest.column || dest.group).name,
          };
          if (dest.column && !target.column) {
            !isGroupExist && data.groupBy.push(group);
          } else if (dest.group && target.group) {
            // reorder
            const sourceIndex = data.groupBy.findIndex(
              g => g.name === dest.group.name
            );
            let targetIndex = data.groupBy.findIndex(
              g => g.name === target.group.name
            );
            if (sourceIndex > -1) {
              [group] = data.groupBy.splice(sourceIndex, 1);
            }
            if (targetIndex === -1) {
              targetIndex = data.groupBy.length;
            }
            data.groupBy.splice(targetIndex, 0, group);
          }
          data.selectedCell = null;
        });
      },
      [setMutableState]
    );

    const handleGroupColumnAdd = React.useCallback(
      (e, group) => {
        setMutableState(data => {
          if (!data.groupBy) {
            data.groupBy = [];
          }
          const groupBy = data.groupBy || [];
          const index = groupBy.findIndex(g => g.name === group.name);
          if (index === -1) {
            groupBy.push(group);
          }
          data.selectedCell = null;
        });
      },
      [setMutableState]
    );

    const handleGroupColumnRemove = React.useCallback(
      (e, group) => {
        setMutableState(data => {
          const groupBy = data.groupBy || [];
          const index = groupBy.findIndex(g => g.name === group.name);
          if (index > -1) {
            groupBy.splice(index, 1);
          }
          data.selectedCell = null;
        });
      },
      [setMutableState]
    );

    const handleRecordComplete = React.useCallback(
      (row, rowIndex, columnIndex, discarded = false, reset = true) => {
        setMutableState(draft => {
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
      [setMutableState]
    );

    const handleRecordSave = React.useCallback(
      async (row, rowIndex, columnIndex, dirty, saveFromEdit) => {
        const isLast = !saveFromEdit && rowIndex === totalRows - 1;
        let result = row;
        if (dirty && onRecordSave) {
          result = await onRecordSave(row, rowIndex);
        }
        if (result) {
          if (isLast && onRecordAdd) {
            onRecordAdd();
            setMutableState(draft => {
              if (draft.editRow) {
                const [rowIndex] = draft.editRow;
                draft.editRow = [rowIndex + 1, 1];
              }
              draft.selectedRows = null;
              draft.selectedCell = null;
            });
          } else {
            handleRecordComplete(
              row,
              rowIndex,
              columnIndex,
              false,
              !saveFromEdit
            );
          }
        }
        return result;
      },
      [totalRows, handleRecordComplete, onRecordAdd, onRecordSave]
    );

    const handleRecordDiscard = React.useCallback(
      (row, rowIndex, columnIndex) => {
        handleRecordComplete(row, rowIndex, columnIndex, true);
        onRecordDiscard && onRecordDiscard(row, rowIndex);
      },
      [handleRecordComplete, onRecordDiscard]
    );

    const handleNavigation = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const { key, ctrlKey, shiftKey } = event;
      if (
        state.editRow ||
        event.isPropagationStopped() ||
        event.defaultPrevented ||
        (event.target &&
          (event.target as HTMLElement).classList.contains(
            styles.focusElement
          )) ||
        ctrlKey ||
        ![
          'Enter',
          'Tab',
          'ArrowRight',
          'ArrowLeft',
          'ArrowUp',
          'ArrowDown',
        ].includes(key)
      )
        return;
      event.preventDefault();

      const { rows, groupBy } = state;
      const columns = getColumns(state.columns);
      const selectedCell = state.selectedCell || [];
      const selectedRows = state.selectedRows || [];
      const selectedCols = state.selectedCols || [];
      const isMultipleSelection = selectionType === 'multiple';
      const data = rows.map(x => x.record.id);
      let [row, col] = selectedCell.length ? selectedCell : [];
      let isHeaderCell = selectedCols.length > 0;

      if (key === 'Enter') {
        const isCheckboxCell = columns[col] && isRowCheck(columns[col]);
        if (isHeaderCell) {
          if (isCheckboxCell) {
            //@ts-ignore
            const [checkbox] = (
              event.target as HTMLElement
            ).getElementsByTagName('input');
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
            return setMutableState(data => {
              data.editRow = [row, col];
            });
          }
        }
      }

      const isTabKey = key === 'Tab';
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
              Helper[isEditMode ? 'findAndShowPrevRows' : 'findLastVisibleRow'](
                row
              )
            );
          }
          return row !== lastRow;
        };
        const moveDown = () => {
          const lastRow = row;
          if (!isHeaderCell) {
            row = Math.min(
              maxRow,
              Helper[isEditMode ? 'findAndShowNextRows' : 'findNextVisibleRow'](
                row
              )
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
            key === 'ArrowLeft' &&
            findRow().state === 'open'
          ) {
            return handleRowStateChange(row, 'close');
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
            key === 'ArrowRight' &&
            findRow().state === 'close'
          ) {
            return handleRowStateChange(row, 'open');
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

      setMutableState(data => {
        const checkAndAssign = (
          key: 'selectedCell' | 'selectedRows' | 'selectedCols',
          value: any
        ) => {
          const toString = (obj: any) => JSON.stringify(obj);
          if (toString(data[key]) !== toString(value)) {
            data[key] = value;
          }
        };

        if (isHeaderCell && !isTabKey) {
          checkAndAssign('selectedCols', [col]);
        } else {
          if ((selectedCols || []).length) {
            data.selectedCols = null;
          }
          checkAndAssign('selectedCell', [row, col]);

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
            checkAndAssign('selectedRows', newRows);
          }
        }
      });
    };

    const handleScroll = e => {
      const container = containerRef.current;
      const header = container && container.querySelector(`.${styles.header}`);
      if (header && stickyHeader) {
        if (!refs.current.stickOffset) {
          refs.current.stickOffset = header.offsetTop + header.offsetHeight;
        }
        const isStick = e.target.scrollTop > refs.current.stickOffset;
        if (isStick) {
          header.classList.add(styles.shadow);
        } else {
          header.classList.remove(styles.shadow);
        }
      }
    };

    const scrollToCell = React.useCallback(
      function scrollToCell([row, col]) {
        if (isNull(row) || isNull(col)) return;
        const container = containerRef.current;
        const rowNode =
          container && container.querySelector(`.${styles.body} .row-${row}`);
        const getCellNode = () => {
          if (!rowNode) return;
          let selector = `.${styles.column}:nth-child(${col + 1})`;
          if (rowNode.classList.contains(styles.groupRow)) {
            selector = `.${styles.groupRowContent}`;
          }
          return rowNode.querySelector(selector);
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
              ? (container.querySelector(`.${styles.header}`) || {})
                  .clientHeight
              : isDownwards
              ? -(
                  (container.querySelector(`.${styles.footer}`) || {})
                    .clientHeight || 0
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
        container && container.focus();
      },
      [stickyHeader, stickyFooter]
    );

    const $orderBy = sortType === 'state' ? state.orderBy : null;
    React.useEffect(() => {
      // generate computed rows from records
      setState(draft => {
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
    }, [records, columns, sortType, $orderBy, state.groupBy]);

    React.useEffect(() => {
      if (!containerRef.current) return;

      // observe resize for grid container
      const observeGrid = new ResizeObserver(
        debounce(() => sizingColumns(), 300)
      );
      observeGrid.observe(containerRef.current);
      return () => {
        observeGrid.disconnect();
      };
    }, [sizingColumns]);

    React.useEffect(() => {
      // exclude hide columns
      setMutableState(draft => {
        draft.columns = columns
          .filter(
            column => !(state.groupBy || []).find(g => g.name === column.name)
          )
          .map(column =>
            column.width ? { ...column, computed: true } : column
          );
      });
      sizingColumns();
    }, [columns, state.groupBy, sizingColumns]);

    React.useEffect(() => {
      if (state.selectedCell) {
        scrollToCell(state.selectedCell);
      }
    }, [state.selectedCell, scrollToCell]);

    const hasAggregation = React.useMemo(
      () => columns.some(column => column.aggregate),
      [columns]
    );

    const displayColumns = React.useMemo(
      () => getColumns(state.columns),
      [state.columns]
    );
    const hiddenColumns = React.useMemo(
      () => state.columns.filter(column => column.visible === false),
      [state.columns]
    );
    const isEditMode = Boolean(state.editRow);
    const checkType = React.useMemo(() => {
      if ((state.selectedRows || []).length === 0) {
        return 'unchecked';
      }
      if (
        state.rows.filter(row => row.type === ROW_TYPE.ROW).length ===
        state.selectedRows?.length
      ) {
        return 'checked';
      }
      return 'indeterminate';
    }, [state.rows, state.selectedRows]);

    return (
      <div
        ref={handleRef}
        className={styleNames(styles.container, className)}
        {...(allowCellSelection
          ? { tabIndex: 0, onKeyDown: handleNavigation }
          : {})}
        onScroll={handleScroll}
      >
        {allowGrouping && (
          <div className={styles.groupArea}>
            <GridGroup
              columns={columns}
              orderBy={state.orderBy}
              groupBy={state.groupBy}
              groupingText={props.groupingText}
              onGroupTagRemove={handleGroupColumnRemove}
              onGroupTagClick={handleSort}
              onGroupTagDrop={handleGroupColumnDrop}
            />
          </div>
        )}
        <GridHeader
          className={styleNames(styles.header, {
            [styles.sticky]: stickyHeader,
          })}
          orderBy={state.orderBy}
          columns={displayColumns}
          hiddenColumns={hiddenColumns}
          rowRenderer={headerRowRenderer}
          checkType={checkType}
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
                      onColumnSort: handleSort,
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
                onRecordSave: handleRecordSave,
                onRecordDiscard: handleRecordDiscard,
              }
            : {})}
          {...(allowSearch
            ? {
                searchRowRenderer,
                searchColumnRenderer,
              }
            : {})}
          {...(allowRowReorder
            ? {
                onRowMove: handleRowMove,
              }
            : {})}
          onCellClick={onCellClick}
          onRowClick={handleRowClick}
          onRowDoubleClick={onRowDoubleClick}
        />
        {hasAggregation && (
          <GridFooter
            className={styleNames(styles.footer, {
              [styles.sticky]: stickyFooter,
            })}
            rowRenderer={footerRowRenderer}
            records={records}
            columns={displayColumns}
          />
        )}
      </div>
    );
  }
);
