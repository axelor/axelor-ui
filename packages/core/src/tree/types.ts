import React from 'react';

export interface TreeNode {
  id?: any;
  data: Record<string, any>;
  children?: boolean | null | number;
  childrenList?: number[];
  expanded?: boolean;
  hover?: boolean;
  selected?: boolean;
  level?: number;
  hidden?: boolean;
  parent?: number | null;
}

export interface TreeColumn {
  name: string;
  title: string;
  width?: number | string;
}

export interface TreeSortColumn {
  name: string;
  order: 'asc' | 'desc';
}

export interface TreeProps {
  records: any[];
  columns: TreeColumn[];
  sortable?: boolean;
  onLoad?: (data: TreeNode, sortColumn?: TreeSortColumn) => any;
  textRenderer?: TreeNodeProps['renderer'];
  nodeRenderer?: TreeNodeProps['renderer'];
  editNodeRenderer?: TreeNodeProps['editRenderer'];
  onNodeMove?: (data: TreeNode, parent: TreeNode) => TreeNode;
  onNodeEdit?: (record: any, recordIndex?: number) => void;
  onNodeSave?: (record: any, recordIndex?: number) => any;
  onNodeDiscard?: (record: any, recordIndex?: number) => void;
}

export interface TreeNodeProps {
  data: TreeNode;
  index: number;
  columns: TreeProps['columns'];
  edit?: boolean;
  onDrop?: (dragData: any, hoverData: any) => any;
  onToggle?: (record: any, index: number, hover?: boolean) => any;
  onSelect?: (
    e: React.SyntheticEvent,
    data: TreeNode,
    index: number,
    cellIndex?: number
  ) => any;
  onEdit?: TreeProps['onNodeEdit'];
  onSave?: TreeProps['onNodeSave'];
  onCancel?: TreeProps['onNodeDiscard'];
  renderer?: React.JSXElementConstructor<any>;
  textRenderer?: React.JSXElementConstructor<any>;
  editRenderer?: React.JSXElementConstructor<any>;
}

export interface TreeColumnProps {
  data: TreeColumn;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.SyntheticEvent, column: TreeColumn) => void;
}

export interface TreeHeaderColumnProps {
  data: TreeColumn;
  sort?: 'asc' | 'desc';
  onSort?: TreeColumnProps['onClick'];
}

export interface TreeChildProps extends TreeNodeProps {
  className?: string;
  onClick?: (e: React.SyntheticEvent) => void;
  onDoubleClick?: (e: React.SyntheticEvent) => void;
}

export interface TreeChildContentProps
  extends Pick<TreeChildProps, 'data' | 'columns' | 'textRenderer'> {}
