import React, { useState, useCallback, useEffect } from 'react';

import { TreeHeaderColumn } from './tree-column';
import { TreeNode } from './tree-node';
import { useClassNames } from '../styles';
import * as TYPES from './types';
import styles from './tree.module.css';

function toNode(record: any): TYPES.TreeNode {
  return {
    id: record.id,
    data: record,
    children: record._children,
    level: 0,
  };
}

export function Tree(props: TYPES.TreeProps) {
  const {
    sortable,
    onLoad,
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
  const [sortColumn, setSortColumn] = useState<TYPES.TreeSortColumn>();

  const selectRow = useCallback(index => {
    setData(data =>
      data.map((row, i) => {
        if (i === index) {
          return { ...row, selected: true };
        }
        return row.selected ? { ...row, selected: false } : row;
      })
    );
  }, []);

  const handleSort = useCallback(column => {
    setSortColumn(sortColumn => {
      return {
        name: column.name,
        order:
          sortColumn?.name === column.name && sortColumn?.order === 'asc'
            ? 'desc'
            : 'asc',
      };
    });
  }, []);

  const handleToggle = useCallback(
    async function handleToggle(record, index, isHover = false) {
      if (!record.loaded && onLoad) {
        record.loaded = true;

        setLoading(true);
        try {
          const children = await onLoad(record, sortColumn);
          setData(data => {
            data.splice(
              index + 1,
              0,
              ...children.map((item: any) => ({
                ...toNode(item),
                parent: record.id,
                level: (record.level || 0) + 1,
              }))
            );
            return [...data];
          });
        } finally {
          setLoading(false);
        }
      }
      const updateKey = isHover ? 'hover' : 'selected';
      setData(data =>
        data
          .map(row => (row[updateKey] ? { ...row, [updateKey]: false } : row))
          .map((row, i) =>
            i === index
              ? {
                  ...row,
                  loaded: true,
                  [updateKey]: true,
                  expanded: !record.expanded,
                }
              : row.parent === record.id
              ? { ...row, hidden: Boolean(record.expanded) }
              : row
          )
      );
    },
    [onLoad, sortColumn]
  );

  const handleSelect = useCallback(
    async function handleSelect(_, record, index) {
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
    async function handleDrop({ data: dragItem }, { data: hoverItem }) {
      setLoading(true);
      try {
        const hoverParent =
          hoverItem.level === dragItem.level ? { id: hoverItem.id } : hoverItem;
        let updatedNode = { ...dragItem };
        if (hoverParent.id !== dragItem.parent && onNodeMove) {
          updatedNode = await onNodeMove(dragItem, hoverParent);
        }
        setData(data => {
          const dragIndex = data.indexOf(dragItem);
          data.splice(dragIndex, 1);

          const hoverIndex = data.indexOf(hoverItem);
          data.splice(hoverIndex + 1, 0, {
            ...updatedNode,
            parent: hoverParent.id,
          });

          return [...data];
        });
      } finally {
        setLoading(false);
      }
    },
    [onNodeMove]
  );

  const handleNodeEdit = useCallback(record => {
    setEditNode(record);
  }, []);

  const handleNodeSave = useCallback(
    async (record, index) => {
      if (onNodeSave) {
        record.data = await onNodeSave(record.data);
      }
      setEditNode(null);
      setData(data => {
        return data.map((rec, ind) => (ind === index ? record : rec));
      });
    },
    [onNodeSave]
  );

  const handleNodeCancel = useCallback(
    record => {
      setEditNode(null);
      onNodeDiscard && onNodeDiscard(record);
    },
    [onNodeDiscard]
  );

  const handleNavigation = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let currentIndex: number = data.findIndex(row => row.selected);
    let activeIndex = currentIndex;

    if (activeIndex > -1) {
      switch (e.key) {
        case 'Enter':
          return handleSelect({}, data[activeIndex], activeIndex);
        case 'ArrowUp':
          for (let i = 0; i < data.length; i++) {
            if (i < currentIndex && !data[i].hidden) {
              activeIndex = i;
            }
          }
          break;
        case 'ArrowDown':
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
    setData(
      (sortColumn
        ? [...records].sort((r1, r2) => {
            const v1 = r1[sortColumn.name];
            const v2 = r2[sortColumn.name];
            if (v1 > v2) return sortColumn.order === 'asc' ? 1 : -1;
            if (v1 < v2) return sortColumn.order === 'asc' ? -1 : 1;
            return 0;
          })
        : [...records]
      ).map(toNode)
    );
  }, [records, sortColumn]);

  useEffect(() => {
    editNode && onNodeEdit && onNodeEdit(editNode);
  }, [editNode, onNodeEdit]);

  const classNames = useClassNames();

  return (
    <div
      className={classNames(styles.tree, {
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
        {columns.map(column => {
          const hasSort = sortColumn && sortColumn.name === column.name;
          return (
            <TreeHeaderColumn
              key={column.name}
              data={column}
              {...(hasSort ? { sort: sortColumn?.order } : {})}
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
        {data.map(
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
