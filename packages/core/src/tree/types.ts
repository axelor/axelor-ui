export interface TreeNode {
  id?: any;
  _children?: boolean | null | number;
  _expanded?: boolean;
  _hover?: boolean;
  _selected?: boolean;
  _level?: number;
  _hidden?: boolean;
  _parent?: number | null;
}

export interface TreeColumn {
  name: string;
  title: string;
}

export interface TreeProps {
  data: TreeNode[];
  columns: TreeColumn[];
  onLoad?: (data: TreeNode) => any;
  nodeRenderer?: TreeNodeProps['renderer'];
  editNodeRenderer?: TreeNodeProps['editRenderer'];
  onNodeMove?: (data: TreeNode, parent: TreeNode) => void;
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
  onToggle?: (record: any, index?: number, hover?: boolean) => any;
  onSelect?: (
    e: React.SyntheticEvent,
    data: TreeNode,
    index?: number,
    cellIndex?: number
  ) => any;
  onEdit?: TreeProps['onNodeEdit'];
  onSave?: TreeProps['onNodeSave'];
  onCancel?: TreeProps['onNodeDiscard'];
  renderer?: React.JSXElementConstructor<any>;
  editRenderer?: React.JSXElementConstructor<any>;
}

export interface TreeChildProps extends TreeNodeProps {
  className?: string;
  onClick?: (e: React.SyntheticEvent) => void;
}

export interface TreeChildContentProps
  extends Pick<TreeChildProps, 'data' | 'columns'> {}
