import * as React from 'react';
import { Box } from '../box';
import OverflowDropdown, { TOverflowListItem } from './overflow-dropdown';
import OverflowScrollList from './overflow-scroll-list';
import cssStyles from './overflow-list.module.css';
import styled, { withStyled } from '../styled';
import { useStyleNames } from '../system';

const StyledOverflowScrollList = styled(OverflowScrollList)();
const StyledOverflowDropdown = styled(OverflowDropdown)();

export interface OverflowListProps<T> {
  scrollable?: boolean;
  inverse?: boolean;
  vertical?: boolean;
  items: T[];
  renderList?: (items: T[]) => React.ReactNode;
  renderListItem?: (
    item: T,
    index: number,
    props?: React.HTMLAttributes<HTMLElement>
  ) => React.ReactChild;
  renderOverflow?: (items: T[], closeDropdown?: () => void) => React.ReactNode;
  renderOverflowItem?: (
    item: T,
    index: number,
    closeDropdown?: () => void
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
    items,
    scrollable = false,
    inverse = false,
    vertical = false,
    renderList,
    renderListItem,
    renderOverflow,
    renderOverflowItem,
    renderButton,
    ...rest
  } = props;
  const Component: any = scrollable
    ? StyledOverflowScrollList
    : StyledOverflowDropdown;
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
          ...(scrollable
            ? {}
            : {
                items,
                renderOverflow,
                renderOverflowItem,
              }),
        }}
        {...rest}
      />
    </Box>
  );
});
