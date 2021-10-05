import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

import styles from './tree.module.css';
import { styleNames } from '../styles';
import { Icon } from '../icon';
import * as TYPES from './types';

const hasChildren = (node: TYPES.TreeNode) => Boolean(node._children);
const NODE_TYPE = 'TREE_NODE';

const TreeNodeContent = React.forwardRef<
  HTMLDivElement,
  TYPES.TreeChildContentProps
>((props, ref) => {
  const { columns, data } = props;
  return (
    <div className={styles.nodeContent} ref={ref}>
      {columns.map((column, ind) => {
        return (
          <div key={column.name} className={styles.column}>
            {ind === 0 && (
              <span
                className="indent"
                style={{ paddingLeft: (data._level || 0) * 16 }}
              >
                {hasChildren(data) && (
                  <Icon
                    size={1}
                    use={data._expanded ? 'chevron-down' : 'chevron-right'}
                    className={styles.icon}
                  />
                )}
              </span>
            )}
            {(data as any)[column.name]}
          </div>
        );
      })}
    </div>
  );
});

function Parent(props: TYPES.TreeChildProps) {
  const { className, columns, data, index, onDrop, onToggle, onClick } = props;
  const [{ hovered }, dropRef] = useDrop({
    accept: NODE_TYPE,
    hover() {
      if (!data._expanded) {
        onToggle && onToggle(data, index, true);
      }
    },
    drop(item: TYPES.TreeNode) {
      onDrop && onDrop(item, { data, index });
    },
    canDrop(props: any) {
      const { _parent }: TYPES.TreeNode = props.data;
      return _parent !== data.id;
    },
    collect: function (monitor) {
      return {
        hovered: monitor.isOver(),
      };
    },
  });
  return (
    <div
      ref={dropRef}
      className={styleNames(className, {
        [styles.hover]: hovered,
      })}
      onClick={onClick}
    >
      <TreeNodeContent data={data} columns={columns} />
    </div>
  );
}

function Leaf(props: TYPES.TreeChildProps) {
  const { className, columns, data, index, onEdit, onClick } = props;
  const [, dragRef, dragPreviewRef] = useDrag({
    type: NODE_TYPE,
    item: { data, index, type: NODE_TYPE },
  });

  function handleEdit(e: React.SyntheticEvent) {
    if (onEdit) {
      e.preventDefault();
      e.stopPropagation();
      onEdit(data, index);
    }
  }

  return (
    <div
      ref={dragRef}
      className={className}
      onClick={onClick}
      onDoubleClick={handleEdit}
    >
      <TreeNodeContent
        {...(index === 0 ? { ref: dragPreviewRef } : {})}
        data={data}
        columns={columns}
      />
    </div>
  );
}

export const TreeNode = React.memo(function TreeNode({
  columns,
  data,
  edit,
  index,
  onEdit,
  onDrop,
  onToggle,
  onSelect,
  onSave,
  onCancel,
  editRenderer,
  renderer: Renderer = React.Fragment,
}: TYPES.TreeNodeProps) {
  const NodeComponent = hasChildren(data) ? Parent : Leaf;
  const RendererComponent = edit && editRenderer ? editRenderer : Renderer;
  return (
    <RendererComponent
      {...(Renderer === React.Fragment
        ? {}
        : {
            data,
          })}
      {...(edit ? { data, index, columns, onCancel, onSave } : {})}
    >
      <NodeComponent
        data={data}
        index={index}
        className={styleNames(styles.node, {
          [styles.selected]: data._selected,
        })}
        columns={columns}
        onClick={(e: React.SyntheticEvent) =>
          onSelect && onSelect(e, data, index)
        }
        {...(editRenderer ? { onEdit } : {})}
        onDrop={onDrop}
        onToggle={onToggle}
      />
    </RendererComponent>
  );
});
