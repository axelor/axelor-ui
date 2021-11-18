import * as React from 'react';
import { SystemProps, makeStyles, omitStyles } from '../system';
import { styleNames } from '../styles';
import { Box } from '../box';
import OverflowDropdown, { TOverflowListItem } from './overflow-dropdown';
import OverflowScrollList from './overflow-scroll-list';
import cssStyles from './overflow-list.module.css';

export interface OverflowListProps<T> extends SystemProps {
  scrollable?: boolean;
  inverse?: boolean;
  vertical?: boolean;
  items: T[];
  renderList?: (items: T[]) => React.ReactNode;
  renderListItem?: (
    item: T,
    props?: React.HTMLAttributes<HTMLElement>
  ) => React.ReactChild;
  renderOverflow?: (items: T[], closeDropdown?: () => void) => React.ReactNode;
  renderOverflowItem?: (
    item: T,
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
  return (
    <Box
      p={2}
      d="flex"
      justifyContent="center"
      border
      className={cssStyles.defaultItem}
    >
      {React.isValidElement(item) ? item : (item as TOverflowListItem).title}
    </Box>
  );
}

export const OverflowList = React.forwardRef<
  HTMLDivElement,
  OverflowListProps<TOverflowListItem | React.ReactChild>
>(
  (
    {
      items,
      className,
      scrollable = false,
      inverse = false,
      vertical = false,
      renderList,
      renderListItem,
      renderOverflow,
      renderOverflowItem,
      renderButton,
      ...props
    },
    ref
  ) => {
    const styles = makeStyles(props);
    const rest = omitStyles(props);
    const Component: any = scrollable ? OverflowScrollList : OverflowDropdown;
    let children = renderList && renderList(items);

    if (!children) {
      children = items.map((item, index) =>
        renderListItem ? (
          renderListItem(item)
        ) : (
          <RenderListItem key={index} item={item} />
        )
      );
    }

    return (
      <Box
        ref={ref}
        className={styleNames(cssStyles.container, {
          [cssStyles.vertical]: vertical,
        })}
        {...rest}
      >
        <Component
          {...{
            className: styleNames(className, styles),
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
        />
      </Box>
    );
  }
);
