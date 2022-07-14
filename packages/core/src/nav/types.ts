import { IconProps } from '../icon';

export interface NavItemProps {
  id: string;
  text?: string;
  title?: string;
  icon?: IconProps['as'];
  iconColor?: string;
  header?: boolean;
  divider?: boolean;
  checkbox?: boolean;
  checked?: boolean;
  disabled?: boolean;
  collapsed?: boolean;
  items?: NavItemProps[];
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export interface NavProps {
  items?: NavItemProps[];
  onClick?: (e: React.MouseEvent<HTMLElement>, item: NavItemProps) => void;
  onRender?: (props: NavProps) => JSX.Element | null;
  onItemRender?: (props: NavItemProps) => JSX.Element | null;
}
