import React, { useState, useCallback, useEffect, useMemo } from "react";

import { TreeHeaderColumn } from "./tree-column";
import { TreeNode } from "./tree-node";
import { useClassNames } from "../styles";
import * as TYPES from "./types";
import styles from "./tree.module.scss";

function toNode({
  $key,
  _draggable,
  _droppable,
  ...record
}: any): TYPES.TreeNode {
  return {
    $key: $key,
    id: record.id,
    data: record,
    children: record._children,
    draggable: _draggable,
    droppable: _droppable,
    level: 0,
  };
}

function getChildrenList(data: any, parent: any): number[] {
  const collectChildrenIds = (parent: any): any => {
    return data
      .filter((item: any) => item.parent === parent)
      .reduce(
        (list: any[], item: any): any => [
          ...list,
          item.$key,
          ...collectChildrenIds(item.$key),
        ],
        []
      );
  };
  return collectChildrenIds(parent);
}

function getParentList(data: any, parent: any): number[] {
  const collectParentIds = (parent: any): any => {
    if (!parent) return [];
    return data
      .filter((item: any) => item.$key === parent)
      .reduce(
        (list: any[], item: any): any => [
          ...list,
          item.$key,
          ...collectParentIds(item.parent),
        ],
        []
      );
  };
  return collectParentIds(parent);
}

export function Tree(props: TYPES.TreeProps) {
  const {
    className,
    sortable,
    onLoad,
    onSort,
    onNodeMove,
    onNodeEdit,
    onNodeSave,
    onNodeDiscard,
    columns,
    records,
    nodeRenderer,
    textRenderer,
    editNodeRenderer,
  } = props;
  const [data, setData] = useState<TYPES.TreeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [editNode, setEditNode] = useState<TYPES.TreeNode | null>(null);
  const [sortColumns, setSortColumns] = useState<TYPES.TreeSortColumn[] | null>(
    null
  );

  const selectRow = useCallback((index: number) => {
    setData((data) =>
      data.map((row, i) => {
        if (i === index) {
          return { ...row, selected: true };
        }
        return row.selected ? { ...row, selected: false } : row;
      })
    );
  }, []);

  const handleSort = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, column: TYPES.TreeColumn) => {
      setSortColumns((sortColumns) => {
        if (!sortColumns) {
          sortColumns = [];
        }
        const exist = sortColumns.find((c) => c.name === column.name);
        if (exist) {
          if (!e.shiftKey) {
            sortColumns = [exist];
          }
          return sortColumns.map((col) => {
            if (col.name === column.name) {
              return { ...col, order: col.order === "asc" ? "desc" : "asc" };
            }
            return col;
          });
        }
        return [
          ...(e.shiftKey ? sortColumns : []),
          {
            name: column.name,
            order: "asc",
          },
        ];
      });
    },
    []
  );

  const handleToggle = useCallback(
    async function handleToggle(record: any, index: number, isHover = false) {
      if (!record.loaded && record.children && onLoad) {
        record.loaded = true;
        try {
          setLoading(true);
          const children = await onLoad(record, sortColumns || []);
          setData((data) => [
            ...data.slice(0, index + 1),
            ...children.map((item: any) => ({
              ...toNode(item),
              parent: record.$key,
            })),
            ...data.slice(index + 1),
          ]);
        } finally {
          setLoading(false);
        }
      }
      const updateKey = isHover ? "hover" : "selected";
      setData((data) =>
        data
          .map((row) => (row[updateKey] ? { ...row, [updateKey]: false } : row))
          .map((row, i) =>
            i === index
              ? {
                  ...row,
                  loaded: true,
                  [updateKey]: true,
                  expanded: !record.expanded,
                }
              : (record.childrenList || []).includes(row.$key)
              ? { ...row, hidden: Boolean(record.expanded) }
              : row
          )
      );
    },
    [onLoad, sortColumns]
  );

  const handleSelect = useCallback(
    async function handleSelect(_: any, record: any, index: number) {
      setEditNode(null);
      if (record.children) {
        await handleToggle(record, index);
      } else {
        selectRow(index);
      }
    },
    [handleToggle, selectRow]
  );

  const handleDrop = useCallback(
    async function handleDrop(
      { data: dragItem }: { data: TYPES.TreeNode },
      { data: hoverItem }: { data: TYPES.TreeNode }
    ) {
      setLoading(true);
      try {
        const hoverParent = hoverItem;

        let updatedNode = { ...dragItem };
        if (hoverParent.$key !== dragItem.parent && onNodeMove) {
          updatedNode = await onNodeMove(
            dragItem,
            hoverParent as TYPES.TreeNode
          );
        }
        setData((data) => {
          const dragIndex = data.findIndex(
            (item) => item.$key === dragItem?.$key
          );
          data.splice(dragIndex, 1);

          let hoverIndex = data.findIndex(
            (item) => item.$key === hoverItem?.$key
          );
          data.splice(hoverIndex + 1, 0, {
            ...updatedNode,
            parent: hoverParent.$key,
          });

          let nextDragItem = dragItem;
          let nextHoverItem = dragItem;

          const childrenList = getChildrenList(data, dragItem.$key);
          if (childrenList.length > 0) {
            childrenList.forEach(($id: number) => {
              const dragIndex = data.findIndex((item) => item.$key === $id);
              if (dragIndex > -1) {
                nextDragItem = data[dragIndex];
                data.splice(dragIndex, 1);
              }
              const hoverIndex = data.findIndex(
                (item) => item.$key === nextHoverItem.$key
              );
              if (hoverIndex > -1) {
                data.splice(hoverIndex + 1, 0, nextDragItem);
                nextHoverItem = nextDragItem;
              }
            });
          }

          return [...data];
        });
      } finally {
        setLoading(false);
      }
    },
    [onNodeMove]
  );

  const handleNodeEdit = useCallback((record: any) => {
    setEditNode(record);
  }, []);

  const handleNodeSave = useCallback(
    async (record: any, index?: number) => {
      if (onNodeSave) {
        record.data = await onNodeSave(record.data);
      }
      setEditNode(null);
      setData((data) => {
        return data.map((rec, ind) => (ind === index ? record : rec));
      });
    },
    [onNodeSave]
  );

  const handleNodeCancel = useCallback(
    (record: any) => {
      setEditNode(null);
      onNodeDiscard && onNodeDiscard(record);
    },
    [onNodeDiscard]
  );

  const handleNavigation = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let currentIndex: number = data.findIndex((row) => row.selected);
    let activeIndex = currentIndex;

    if (activeIndex > -1) {
      switch (e.key) {
        case "Enter":
          return handleSelect({}, data[activeIndex], activeIndex);
        case "ArrowUp":
          for (let i = 0; i < data.length; i++) {
            if (i < currentIndex && !data[i].hidden) {
              activeIndex = i;
            }
          }
          break;
        case "ArrowDown":
          for (let i = 0; i < data.length; i++) {
            if (i > currentIndex && !data[i].hidden) {
              activeIndex = i;
              break;
            }
          }
          break;
      }
    }

    selectRow(Math.max(0, activeIndex));
  };

  useEffect(() => {
    const [sortColumn] = sortColumns || [];
    setData(
      (sortColumn && !onSort
        ? [...records].sort((r1, r2) => {
            const v1 = r1[sortColumn.name];
            const v2 = r2[sortColumn.name];
            if (v1 > v2) return sortColumn.order === "asc" ? 1 : -1;
            if (v1 < v2) return sortColumn.order === "asc" ? -1 : 1;
            return 0;
          })
        : [...records]
      ).map(toNode)
    );
  }, [records, sortColumns, onSort]);

  useEffect(() => {
    onSort && sortColumns && onSort(sortColumns);
  }, [sortColumns, onSort]);

  useEffect(() => {
    editNode && onNodeEdit && onNodeEdit(editNode);
  }, [editNode, onNodeEdit]);

  const classNames = useClassNames();

  const $data = useMemo(() => {
    return data.map((item: any) => {
      const childrenList = getChildrenList(data, item.$key);
      const parentList = getParentList(data, item.parent);
      return {
        ...item,
        ...(item.loaded
          ? {
              children: childrenList.length ? true : false,
            }
          : {}),
        level: parentList.length,
        childrenList,
      };
    });
  }, [data]);

  return (
    <div
      className={classNames("table-tree", className, styles.tree, {
        [styles.loading]: loading,
      })}
      {...(editNode
        ? {}
        : {
            tabIndex: 0,
            onKeyDown: handleNavigation,
          })}
    >
      <div className={styles.header}>
        {columns.map((column) => {
          const sortColumn = (sortColumns || []).find(
            (c) => c.name === column.name
          );
          return (
            <TreeHeaderColumn
              key={column.name}
              data={column}
              {...(sortColumn ? { sort: sortColumn.order } : {})}
              {...(sortable
                ? {
                    onSort: handleSort,
                  }
                : {})}
            />
          );
        })}
      </div>
      <div className={styles.body}>
        {$data.map(
          (row, rowIndex) =>
            !row.hidden && (
              <TreeNode
                key={rowIndex}
                index={rowIndex}
                columns={columns}
                edit={editNode === row}
                data={row}
                renderer={nodeRenderer}
                textRenderer={textRenderer}
                editRenderer={editNodeRenderer}
                onToggle={handleToggle}
                onSelect={handleSelect}
                {...(editNode ? {} : { onDrop: handleDrop })}
                onEdit={handleNodeEdit}
                onSave={handleNodeSave}
                onCancel={handleNodeCancel}
              />
            )
        )}
      </div>
    </div>
  );
}
