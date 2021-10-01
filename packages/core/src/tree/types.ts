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
  onUpdate?: (data: TreeNode, parent: TreeNode) => void;
  onLoad?: (data: TreeNode) => any;
  nodeRenderer?: TreeNodeProps['renderer'];
}

export interface TreeNodeProps {
  data: TreeNode;
  index: number;
  columns: TreeProps['columns'];
  onDrop?: (dragData: any, hoverData: any) => any;
  onToggle?: (record: any, index?: number, hover?: boolean) => any;
  onSelect?: (
    e: React.SyntheticEvent,
    data: TreeNode,
    index?: number,
    cellIndex?: number
  ) => any;
  renderer?: React.JSXElementConstructor<any>;
}

export interface TreeChildProps extends TreeNodeProps {
  className?: string;
  onClick?: (e: React.SyntheticEvent) => void;
}

export interface TreeChildContentProps
  extends Pick<TreeChildProps, 'data' | 'columns'> {}
