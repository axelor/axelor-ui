import { IconProps } from '../icon/icon';
import { MenuProps } from '../menu/menu';

export type OverflowState = {
  measure: boolean;
  offset: number;
  listOffset: number;
  compute: number;
};

export type Mode = 'shrink' | 'grow';
export type Action = Mode | 'measure' | 'compute';
export type OverflowListButtonType =
  | 'scroll-left'
  | 'scroll-right'
  | 'dropdown';

export interface OverflowListItemProps {
  title: string;
  icon?: IconProps['as'];
  [propertyName: string]: any;
}

export interface OverflowListProps {
  items: OverflowListItemProps[];
  scrollable?: boolean;
  inverse?: boolean;
  vertical?: boolean;
  dropdownRef?: React.RefObject<
    | {
        compute(): void;
      }
    | undefined
  >;
  dropdownMenuProps?: Partial<MenuProps>;
  renderList?: (items: OverflowListItemProps[]) => JSX.Element | JSX.Element[];
  renderListItem?: (
    item: OverflowListItemProps,
    index: number,
    props?: React.HTMLAttributes<HTMLElement>
  ) => React.ReactChild;
  renderButton?: (
    type: OverflowListButtonType,
    props?: React.HTMLAttributes<HTMLElement>
  ) => React.ReactChild | null;
  renderOverflow?: (
    items: OverflowListItemProps[],
    closeDropdown?: () => void
  ) => React.ReactNode;
  renderOverflowItem?: (
    item: OverflowListItemProps,
    index: number,
    closeDropdown?: () => void
  ) => React.ReactNode;
  onOverflowChange?: (offset: number) => void;
}

export interface OverflowDropdownProps
  extends Pick<
    OverflowListProps,
    | 'items'
    | 'inverse'
    | 'vertical'
    | 'renderOverflow'
    | 'renderOverflowItem'
    | 'renderButton'
    | 'dropdownMenuProps'
    | 'onOverflowChange'
  > {
  className?: string;
  children: React.ReactElement;
}

export interface OverflowScrollListProps
  extends Pick<OverflowListProps, 'inverse' | 'vertical' | 'renderButton'> {
  className?: string;
  children?: React.ReactNode;
}
