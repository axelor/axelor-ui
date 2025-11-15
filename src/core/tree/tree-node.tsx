import React, { useCallback, useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

import { MaterialIcon } from "../../icons/material-icon";
import { Box } from "../box";
import { useClassNames, useTheme } from "../styles";
import { findDataProp, makeTestId } from "../system/utils";
import { TreeColumn } from "./tree-column";
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
  const testId = findDataProp(props, "data-testid");

  function render(column: TYPES.TreeColumn) {
    if (textRenderer) {
      const Renderer = textRenderer;
      return <Renderer column={column} data={data} />;
    }
    return (data as any).data[column.name];
  }
  return (
    <div className={styles.nodeContent} ref={ref} role={"presentation"}>
      {columns.map((column, ind) => {
        return (
          <TreeColumn
            data={column}
            key={column.name}
            role="gridcell"
            aria-colindex={ind + 1}
            data-testid={makeTestId(testId, "column", column.name)}
          >
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
                    data-testid={makeTestId(testId, "icon")}
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
    edit,
    index,
    textRenderer,
    onEdit,
    onToggle,
    onDrop,
    onSelect,
    onClick,
    onDoubleClick,
    ...rest
  } = props;
  const ref = useRef(null);
  const classNames = useClassNames();
  const testId = findDataProp(props, "data-testid");
  const [{ isDragging }, dragRef, dragPreviewRef] = useDrag({
    type: NODE_TYPE,
    canDrag: () => data.draggable === true,
    item: { data, index, type: NODE_TYPE },

    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const timerRef = useRef<NodeJS.Timeout>(null);
  const toggleRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

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
      if (!data.expanded && !isSame() && !isChildren() && !toggleRef.current) {
        toggleRef.current = window.setTimeout(async () => {
          await onToggle?.(data, index, true);
          toggleRef.current = null;
        }, 500);
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
    clearTimer();
    timerRef.current = setTimeout(() => {
      onClick?.(e);
    }, 200);
  }

  function handleDoubleClick(e: React.SyntheticEvent) {
    clearTimer();
    if (onEdit) {
      e.preventDefault();
      e.stopPropagation();
      onEdit(data, index);
    }
    onDoubleClick?.(e);
  }

  const handleDragLeave = useCallback(() => {
    setTimeout(() => {
      if (toggleRef.current) {
        clearTimeout(toggleRef.current);
        toggleRef.current = null;
      }
    });
  }, []);

  dragRef(dropRef(ref));

  useEffect(() => {
    isDragging && onSelect?.({} as any, {} as any, index);
  }, [index, onSelect, isDragging]);

  useEffect(() => {
    // cleanup
    return () => {
      clearTimer();
      toggleRef.current && clearTimeout(toggleRef.current);
    };
  }, [clearTimer]);

  return (
    <div
      ref={ref}
      className={classNames(className, {
        [styles.dragging]: isDragging,
        [styles.hover]: hovered && highlighted,
      })}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onDragLeave={handleDragLeave}
      {...rest}
    >
      <TreeNodeContent
        {...(index === 0
          ? {
              ref: (node) => {
                dragPreviewRef(node);
              },
            }
          : {})}
        data={data}
        columns={columns}
        textRenderer={textRenderer}
        data-testid={makeTestId(testId, "content")}
      />
    </div>
  );
}

export function RootDroppable(props: {
  text?: TYPES.TreeProps["droppableText"];
  onDrop: TYPES.TreeNodeProps["onDrop"];
}) {
  const { text, onDrop } = props;
  const classNames = useClassNames();
  const testId = findDataProp(props, "data-testid");

  const [{ highlighted, hovered }, dropRef] = useDrop({
    accept: NODE_TYPE,
    hover(item: any) {
      return true;
    },
    drop(item: TYPES.TreeNode) {
      onDrop?.(item, {
        data: {
          data: null,
        },
      });
    },
    canDrop({ data }: TYPES.TreeNode) {
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
      ref={(node) => {
        dropRef(node);
      }}
      className={classNames(styles.rootNode, {
        [styles.active]: highlighted,
        [styles.hover]: hovered,
      })}
      data-testid={testId}
    >
      <Box className={styles.rootNodeContent} d="flex" flex={1} alignItems={"center"} justifyContent={"center"}>
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
  ...rest
}: TYPES.TreeNodeProps) {
  const RendererComponent = edit && editRenderer ? editRenderer : Renderer;
  const testId = findDataProp(rest, "data-testid");
  const classNames = useClassNames();

  const ariaProps = {
    "aria-expanded": hasChildren(data) ? data.expanded : undefined,
    "aria-level": data.level !== undefined ? data.level + 1 : undefined,
    "aria-selected": data.selected || undefined,
    "aria-busy": edit || undefined,
    "data-testid": testId,
    role: "row",
  };

  return (
    <RendererComponent
      {...(Renderer === React.Fragment
        ? {}
        : {
            data,
          })}
      {...(edit
        ? { node: data, index, columns, onCancel, onSave }
        : {})}
    >
      <DNDTreeNode
        data={data}
        index={index}
        edit={edit}
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
        {...ariaProps}
      />
    </RendererComponent>
  );
});
