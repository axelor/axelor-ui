import React, { useState, useCallback, useEffect } from 'react';

import { TreeNode } from './tree-node';
import { styleNames } from '../styles';
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
    onLoad,
    onNodeMove,
    onNodeEdit,
    onNodeSave,
    onNodeDiscard,
    columns,
    records,
    nodeRenderer,
    editNodeRenderer,
  } = props;
  const [data, setData] = useState<TYPES.TreeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [editNode, setEditNode] = useState<TYPES.TreeNode | null>(null);

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

  const handleToggle = useCallback(
    async function handleToggle(record, index, isHover = false) {
      if (!record.loaded && onLoad) {
        record.loaded = true;

        setLoading(true);
        try {
          const children = await onLoad(record.data);
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
    [onLoad]
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
    [handleToggle]
  );

  const handleDrop = useCallback(
    async function handleDrop({ data: dragItem }, { data: hoverItem }) {
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
        data.splice(hoverIndex + 1, 0, { ...updatedNode, parent: hoverParent.id });

        return [...data];
      });
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
    setData([...records].map(toNode));
  }, [records]);

  useEffect(() => {
    editNode && onNodeEdit && onNodeEdit(editNode);
  }, [editNode, onNodeEdit]);

  return (
    <div
      className={styleNames(styles.tree, {
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
        {columns.map(column => (
          <div
            key={column.name}
            className={styleNames(styles.headerColumn, styles.column)}
          >
            {column.title}
          </div>
        ))}
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
