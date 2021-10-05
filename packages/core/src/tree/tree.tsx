import React, { useState, useCallback, useEffect } from 'react';

import { TreeNode } from './tree-node';
import { styleNames } from '../styles';
import * as TYPES from './types';
import styles from './tree.module.css';

export function Tree(props: TYPES.TreeProps) {
  const {
    onLoad,
    onNodeMove,
    onNodeEdit,
    onNodeSave,
    onNodeDiscard,
    columns,
    data: _data,
    nodeRenderer,
    editNodeRenderer,
  } = props;
  const [data, setData] = useState<TYPES.TreeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [editNode, setEditNode] = useState<TYPES.TreeNode | null>(null);

  const selectRow = useCallback(index => {
    setData(data =>
      data.map((_row, i) => {
        if (i === index) {
          return { ..._row, _selected: true };
        }
        return _row._selected ? { ..._row, _selected: false } : _row;
      })
    );
  }, []);

  const handleToggle = useCallback(
    async function handleToggle(record, index, isHover = false) {
      if (!record._loaded && onLoad) {
        record._loaded = true;

        setLoading(true);
        try {
          const children: TYPES.TreeNode[] = await onLoad(record);
          setData(data => {
            data.splice(
              index + 1,
              0,
              ...children.map(item => ({
                ...item,
                _parent: record.id,
                _level: (record._level || 0) + 1,
              }))
            );
            return [...data];
          });
        } finally {
          setLoading(false);
        }
      }
      const updateKey = isHover ? '_hover' : '_selected';
      setData(data =>
        data
          .map(_row =>
            _row[updateKey] ? { ..._row, [updateKey]: false } : _row
          )
          .map((_row, i) =>
            i === index
              ? {
                  ..._row,
                  _loaded: true,
                  [updateKey]: true,
                  _expanded: !record._expanded,
                }
              : _row._parent === record.id
              ? { ..._row, _hidden: Boolean(record._expanded) }
              : _row
          )
      );
    },
    [onLoad]
  );

  const handleSelect = useCallback(
    async function handleSelect(_, record, index) {
      setEditNode(null);
      if (record._children) {
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
        hoverItem._level === dragItem._level ? { id: hoverItem.id } : hoverItem;
      let updatedNode = { ...dragItem };
      if (hoverParent.id !== dragItem._parent && onNodeMove) {
        updatedNode = await onNodeMove(dragItem, hoverParent);
        updatedNode._parent = hoverParent.id;
      }
      setData(data => {
        const dragIndex = data.indexOf(dragItem);
        const [dragNode] = data.splice(dragIndex, 1);

        const hoverIndex = data.indexOf(hoverItem);
        data.splice(hoverIndex + 1, 0, dragNode);

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
      let updatedRecord = record;
      if (onNodeSave) {
        updatedRecord = await onNodeSave(record);
      }
      setEditNode(null);
      setData(data => {
        return data.map((rec, ind) => (ind === index ? record : rec));
      });
    },
    [onNodeSave]
  );

  const handleNodeCancel = useCallback(record => {
    setEditNode(null);
    onNodeDiscard && onNodeDiscard(record);
  }, [onNodeDiscard]);

  const handleNavigation = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let currentIndex: number = data.findIndex(row => row._selected);
    let activeIndex = currentIndex;

    if (activeIndex > -1) {
      switch (e.key) {
        case 'Enter':
          return handleSelect({}, data[activeIndex], activeIndex);
        case 'ArrowUp':
          for (let i = 0; i < data.length; i++) {
            if (i < currentIndex && !data[i]._hidden) {
              activeIndex = i;
            }
          }
          break;
        case 'ArrowDown':
          for (let i = 0; i < data.length; i++) {
            if (i > currentIndex && !data[i]._hidden) {
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
    setData([..._data].map(item => ({ ...item, _level: 0 })));
  }, [_data]);

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
            !row._hidden && (
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
