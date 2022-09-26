import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ReactComponent as BiChevronDown } from 'bootstrap-icons/icons/chevron-down.svg';
import { ReactComponent as BiChevronRight } from 'bootstrap-icons/icons/chevron-right.svg';
import { ReactComponent as BiChevronLeft } from 'bootstrap-icons/icons/chevron-left.svg';

import { Box } from '../box';
import { TreeColumn } from './tree-column';
import styles from './tree.module.css';
import { useClassNames, useTheme } from '../styles';
import { Icon } from '../icon';
import * as TYPES from './types';

const hasChildren = (node: TYPES.TreeNode) => Boolean(node.children);
const NODE_TYPE = 'TREE_NODE';

const TreeNodeContent = React.forwardRef<
  HTMLDivElement,
  TYPES.TreeChildContentProps
>((props, ref) => {
  const { columns, data, textRenderer } = props;
  const { dir } = useTheme();
  const rtl = dir === 'rtl';

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
              <Box
                as="span"
                d="flex"
                className="indent"
                style={{
                  marginLeft: `${data.level || 0}rem`,
                  width: 20,
                }}
              >
                {hasChildren(data) && (
                  <Icon
                    size={1}
                    as={
                      data.expanded
                        ? BiChevronDown
                        : rtl
                        ? BiChevronLeft
                        : BiChevronRight
                    }
                    className={styles.icon}
                  />
                )}
              </Box>
            )}
            <span className={styles.nodeText}>{render(column)}</span>
          </TreeColumn>
        );
      })}
    </div>
  );
});

function DNDTreeNode(props: TYPES.TreeChildProps) {
  const {
    className,
    columns,
    data,
    index,
    textRenderer,
    onEdit,
    onToggle,
    onDrop,
    onClick,
    onDoubleClick,
  } = props;
  const ref = useRef(null);
  const classNames = useClassNames();
  const [, dragRef, dragPreviewRef] = useDrag({
    type: NODE_TYPE,
    item: { data, index, type: NODE_TYPE },
  });

  const [{ hovered, highlighted }, dropRef] = useDrop({
    accept: NODE_TYPE,
    hover(item: any) {
      const { id, childrenList = [] } = item.data || {};
      function isSame() {
        return id === data.id;
      }
      function isChildren() {
        return childrenList.includes(data.id);
      }
      if (!data.expanded && !isSame() && !isChildren()) {
        onToggle && onToggle(data, index, true);
      }
    },
    drop(item: TYPES.TreeNode) {
      onDrop && onDrop(item, { data, index });
    },
    canDrop(props: any) {
      const { parent, childrenList = [] }: TYPES.TreeNode = props.data;
      function isSameParent() {
        return parent === data.id;
      }
      function isChildren() {
        return childrenList.includes(data.id);
      }
      return !isSameParent() && !isChildren();
    },
    collect: function (monitor) {
      return {
        highlighted: monitor.canDrop(),
        hovered: monitor.isOver(),
      };
    },
  });

  function handleEdit(e: React.SyntheticEvent) {
    if (onEdit) {
      e.preventDefault();
      e.stopPropagation();
      onEdit(data, index);
    }
    onDoubleClick && onDoubleClick(e);
  }

  dragRef(dropRef(ref));
  return (
    <div
      ref={ref}
      className={classNames(className, {
        [styles.hover]: hovered && highlighted,
      })}
      onClick={onClick}
      onDoubleClick={handleEdit}
    >
      <TreeNodeContent
        {...(index === 0 ? { ref: dragPreviewRef } : {})}
        data={data}
        columns={columns}
        textRenderer={textRenderer}
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
      <DNDTreeNode
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
