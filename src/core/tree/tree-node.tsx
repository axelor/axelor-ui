import React, { useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

import { Box } from "../box";
import { TreeColumn } from "./tree-column";
import { useClassNames, useTheme } from "../styles";
import { MaterialIcon } from "../../icons/material-icon";
import * as TYPES from "./types";
import styles from "./tree.module.scss";

const hasChildren = (node: TYPES.TreeNode) => Boolean(node.children);
const NODE_TYPE = "TREE_NODE";

const TreeNodeContent = React.forwardRef<
  HTMLDivElement,
  TYPES.TreeChildContentProps
>((props, ref) => {
  const { columns, data, textRenderer } = props;
  const { dir } = useTheme();
  const rtl = dir === "rtl";

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
                me={1}
                className={styles.indent}
                style={{
                  [rtl ? "marginRight" : "marginLeft"]: `${data.level ?? 0}rem`,
                }}
              >
                {hasChildren(data) && (
                  <MaterialIcon
                    icon={
                      data.expanded
                        ? "arrow_drop_down"
                        : rtl
                          ? "arrow_left"
                          : "arrow_right"
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
    onSelect,
    onClick,
    onDoubleClick,
  } = props;
  const ref = useRef(null);
  const classNames = useClassNames();
  const [{ isDragging }, dragRef, dragPreviewRef] = useDrag({
    type: NODE_TYPE,
    canDrag: () => data.draggable === true,
    item: { data, index, type: NODE_TYPE },

    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const timerRef = useRef<number>();

  const [{ hovered, highlighted }, dropRef] = useDrop({
    accept: NODE_TYPE,
    hover(item: any) {
      const { $key, childrenList = [] } = item.data || {};
      function isSame() {
        return $key === data.$key;
      }
      function isChildren() {
        return childrenList.includes(data.$key);
      }
      if (!data.expanded && !isSame() && !isChildren()) {
        onToggle && onToggle(data, index, true);
      }
    },
    drop(item: TYPES.TreeNode) {
      onDrop && onDrop(item, { data, index });
    },
    canDrop(props: any) {
      const { $key, parent, childrenList = [] }: TYPES.TreeNode = props.data;
      function isOwn() {
        return $key === data.$key;
      }
      function isSameParent() {
        return parent === data.$key;
      }
      function isChildren() {
        return childrenList.includes(data.$key);
      }

      return Boolean(
        data.droppable && !isOwn() && !isSameParent() && !isChildren(),
      );
    },
    collect: function (monitor) {
      return {
        highlighted: monitor.canDrop(),
        hovered: monitor.isOver(),
      };
    },
  });

  function handleClick(e: React.SyntheticEvent) {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      onClick?.(e);
    }, 200);
  }

  function handleDoubleClick(e: React.SyntheticEvent) {
    window.clearTimeout(timerRef.current);
    if (onEdit) {
      e.preventDefault();
      e.stopPropagation();
      onEdit(data, index);
    }
    onDoubleClick?.(e);
  }

  dragRef(dropRef(ref));

  useEffect(() => {
    isDragging && onSelect?.({} as any, {} as any, index);
  }, [index, onSelect, isDragging]);

  return (
    <div
      ref={ref}
      className={classNames(className, {
        [styles.dragging]: isDragging,
        [styles.hover]: hovered && highlighted,
      })}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
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

export function RootDroppable({
  text,
  onDrop,
}: {
  text?: TYPES.TreeProps["droppableText"];
  onDrop: TYPES.TreeNodeProps["onDrop"];
}) {
  const classNames = useClassNames();

  const [{ highlighted }, dropRef] = useDrop({
    accept: NODE_TYPE,
    hover(item: any) {
      return true;
    },
    drop(item: TYPES.TreeNode) {
      onDrop &&
        onDrop(item, {
          data: {
            data: null,
          },
        });
    },
    canDrop({ data }: { data: TYPES.TreeNode }) {
      const { parent } = data;
      return Boolean(parent);
    },
    collect: function (monitor) {
      return {
        highlighted: monitor.canDrop(),
        hovered: monitor.isOver(),
      };
    },
  });

  return (
    <Box
      pt={1}
      d="flex"
      ref={dropRef}
      className={classNames(styles.rootNode, {
        [styles.active]: highlighted,
      })}
    >
      <Box d="flex" flex={1} alignItems={"center"} justifyContent={"center"}>
        {text ?? "Drop here"}
      </Box>
    </Box>
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
        onSelect={onSelect}
        {...(editRenderer ? { onEdit } : {})}
        onDrop={onDrop}
        onToggle={onToggle}
      />
    </RendererComponent>
  );
});
