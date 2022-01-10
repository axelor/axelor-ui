import * as React from 'react';
import { Box } from '../box';
import OverflowDropdown, {
  OverflowDropdownProps,
  TOverflowListItem,
} from './overflow-dropdown';
import OverflowScrollList from './overflow-scroll-list';
import cssStyles from './overflow-list.module.css';
import { withStyled } from '../styled';
import { useStyleNames } from '../system';

export interface OverflowListProps<T>
  extends Pick<
    OverflowDropdownProps<TOverflowListItem>,
    | 'items'
    | 'renderOverflow'
    | 'renderOverflowItem'
    | 'dropdownMenuProps'
    | 'onOverflowChange'
  > {
  scrollable?: boolean;
  inverse?: boolean;
  vertical?: boolean;
  dropdownRef?: React.RefObject<
    | {
        compute(): void;
      }
    | undefined
  >;
  renderList?: (items: T[]) => React.ReactNode;
  renderListItem?: (
    item: T,
    index: number,
    props?: React.HTMLAttributes<HTMLElement>
  ) => React.ReactChild;
  renderButton?: (
    type: 'scroll-left' | 'scroll-right' | 'dropdown',
    props?: React.HTMLAttributes<HTMLElement>
  ) => React.ReactChild | null;
}

function RenderListItem({
  item,
}: {
  item: TOverflowListItem | React.ReactChild;
}) {
  return React.isValidElement(item) ? (
    item
  ) : (
    <Box
      p={2}
      d="flex"
      justifyContent="center"
      border
      className={cssStyles.defaultItem}
    >
      {(item as TOverflowListItem).title}
    </Box>
  );
}

export const OverflowList = withStyled(Box)<
  OverflowListProps<TOverflowListItem | React.ReactChild>
>((props, ref) => {
  const {
    as,
    dropdownRef,
    items,
    scrollable = false,
    inverse = false,
    vertical = false,
    renderList,
    renderListItem,
    renderOverflow,
    renderOverflowItem,
    renderButton,
    dropdownMenuProps,
    onOverflowChange,
    ...rest
  } = props;
  const Component: any = scrollable ? OverflowScrollList : OverflowDropdown;
  let children = renderList && renderList(items);

  if (!children) {
    children = items.map((item, index) =>
      renderListItem ? (
        renderListItem(item, index)
      ) : (
        <RenderListItem key={index} item={item} />
      )
    );
  }
  const classes = useStyleNames(
    () => [
      cssStyles.container,
      {
        [cssStyles.vertical]: vertical,
      },
    ],
    [vertical]
  );

  return (
    <Box ref={ref} className={classes}>
      <Component
        {...{
          inverse,
          vertical,
          children,
          renderButton,
          ref: dropdownRef,
          ...(scrollable
            ? {}
            : {
                items,
                renderAs: as,
                renderOverflow,
                renderOverflowItem,
                dropdownMenuProps,
                onOverflowChange,
              }),
        }}
        {...rest}
      />
    </Box>
  );
});
