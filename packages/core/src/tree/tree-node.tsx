import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ReactComponent as BiChevronDown } from 'bootstrap-icons/icons/chevron-down.svg';
import { ReactComponent as BiChevronRight } from 'bootstrap-icons/icons/chevron-right.svg';

import { TreeColumn } from './tree-column';
import styles from './tree.module.css';
import { useClassNames } from '../styles';
import { Icon } from '../icon';
import * as TYPES from './types';

const hasChildren = (node: TYPES.TreeNode) => Boolean(node.children);
const NODE_TYPE = 'TREE_NODE';

const TreeNodeContent = React.forwardRef<
  HTMLDivElement,
  TYPES.TreeChildContentProps
>((props, ref) => {
  const { columns, data, textRenderer } = props;
  function render(column: TYPES.TreeColumn) {
    if (textRenderer) {
      const Renderer = textRenderer;
      return <Renderer column={column} data={data} />;
    }
    return (data as any).data[column.name];
  }
  return (
    <div className={styles.nodeContent} ref={ref}>
      {columns.map((column, ind) => {
        return (
          <TreeColumn data={column} key={column.name}>
            {ind === 0 && (
              <span
                className="indent"
                style={{ paddingLeft: (data.level || 0) * 16 }}
              >
                {hasChildren(data) && (
                  <Icon
                    size={1}
                    as={data.expanded ? BiChevronDown : BiChevronRight}
                    className={styles.icon}
                  />
                )}
              </span>
            )}
            <span className={styles.nodeText}>{render(column)}</span>
          </TreeColumn>
        );
      })}
    </div>
  );
});

function Parent(props: TYPES.TreeChildProps) {
  const { className, columns, data, index, onDrop, onToggle, onClick } = props;
  const classNames = useClassNames();
  const [{ hovered }, dropRef] = useDrop({
    accept: NODE_TYPE,
    hover() {
      if (!data.expanded) {
        onToggle && onToggle(data, index, true);
      }
    },
    drop(item: TYPES.TreeNode) {
      onDrop && onDrop(item, { data, index });
    },
    canDrop(props: any) {
      const { parent }: TYPES.TreeNode = props.data;
      return parent !== data.id;
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
      className={classNames(className, {
        [styles.hover]: hovered,
      })}
      onClick={onClick}
    >
      <TreeNodeContent data={data} columns={columns} />
    </div>
  );
}

function Leaf(props: TYPES.TreeChildProps) {
  const {
    className,
    columns,
    data,
    textRenderer,
    index,
    onEdit,
    onDoubleClick,
    onClick,
  } = props;
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
    onDoubleClick && onDoubleClick(e);
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
        textRenderer={textRenderer}
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
  textRenderer,
  renderer: Renderer = React.Fragment,
}: TYPES.TreeNodeProps) {
  const NodeComponent = hasChildren(data) ? Parent : Leaf;
  const RendererComponent = edit && editRenderer ? editRenderer : Renderer;
  const classNames = useClassNames();
  return (
    <RendererComponent
      {...(Renderer === React.Fragment
        ? {}
        : {
            data,
          })}
      {...(edit ? { node: data, index, columns, onCancel, onSave } : {})}
    >
      <NodeComponent
        data={data}
        index={index}
        className={classNames(styles.node, {
          [styles.selected]: data.selected,
        })}
        columns={columns}
        textRenderer={textRenderer}
        onClick={(e: React.SyntheticEvent) => {
          onSelect && onSelect(e, data, index);
        }}
        {...(editRenderer ? { onEdit } : {})}
        onDrop={onDrop}
        onToggle={onToggle}
      />
    </RendererComponent>
  );
});
