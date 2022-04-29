import React from 'react';
import { ReactComponent as BiCaretDownFill } from 'bootstrap-icons/icons/caret-down-fill.svg';

import { Box } from '../box/box';
import { Icon } from '../icon';
import { OverflowList, OverflowListTypes } from '../overflow-list';
import { MenuItem } from '../menu/menu-item';
import { MenuProps } from '../menu/menu';
import { useClassNames, useTheme } from '../styles';
import { withStyled } from '../styled';
import cssStyles from './nav-select.module.scss';

export interface TNavSelectItem {
  title: string;
  value: string | number;
}

export interface NavSelectProps {
  items: TNavSelectItem[];
  value: TNavSelectItem | null;
  onChange: (value: TNavSelectItem) => void;
  disabled?: Boolean;
}

const menuConfig: Partial<MenuProps> = {
  offset: [0, 4],
  disablePortal: true,
};

interface NavSelectItemProps {
  active?: Boolean;
}

const NavSelectItem = withStyled(Box)<NavSelectItemProps>((props, ref) => {
  const { active, className, children, ...rest } = props;
  const classNames = useClassNames();
  const { dir = '' } = useTheme();
  return (
    <Box
      ref={ref}
      {...rest}
      className={classNames(className, {
        [cssStyles.active]: Boolean(active),
        [cssStyles[dir]]: dir,
      })}
    >
      <a>{children}</a>
    </Box>
  );
});

export function NavSelect({
  items,
  value: selected,
  onChange,
  disabled,
}: NavSelectProps) {
  const [offset, setOffset] = React.useState<number>(-1);
  const overflowDropdown = React.useRef<{
    compute(): void;
  }>();

  function handleItemClick(item: TNavSelectItem) {
    !disabled && onChange(item);
  }

  const selectedHidden =
    selected &&
    offset >= 0 &&
    items.slice(offset).find(item => item.value === selected.value);

  React.useEffect(() => {
    const ref = overflowDropdown.current;
    if (selectedHidden && ref?.compute) {
      ref.compute();
    }
  }, [selectedHidden]);

  const classNames = useClassNames();

  return (
    <Box className={cssStyles.root}>
      <OverflowList
        items={items}
        className={cssStyles.list}
        dropdownRef={overflowDropdown}
        dropdownMenuProps={menuConfig}
        {...(selected
          ? {
              onOverflowChange: setOffset,
            }
          : {})}
        renderListItem={(
          _item: OverflowListTypes.OverflowListItemProps,
          index: number
        ) => {
          const item = _item as TNavSelectItem;
          const selectedInListItem =
            selectedHidden &&
            offset >= items.length - 1 &&
            offset - 1 === index;
          return (
            <NavSelectItem
              key={index}
              active={selectedInListItem || item.value === selected?.value}
              className={classNames(cssStyles.listItem, {
                [cssStyles.last]: index === items.length - 1,
              })}
              onClick={() => handleItemClick(item)}
            >
              {selectedInListItem && selectedHidden
                ? selectedHidden.title
                : item.title}
            </NavSelectItem>
          );
        }}
        renderOverflow={(
          items: OverflowListTypes.OverflowListItemProps[],
          closeDropdown?: () => void
        ) => {
          return (items as TNavSelectItem[]).map((item, index) => {
            return (
              <MenuItem
                key={index}
                as="button"
                d="flex"
                justifyContent="center"
                className={classNames(cssStyles.overflowListItem, {
                  [cssStyles.active]: item.value === selected?.value,
                })}
                onClick={() => {
                  closeDropdown && closeDropdown();
                  handleItemClick(item);
                }}
              >
                {item.title}
              </MenuItem>
            );
          });
        }}
        renderButton={(
          type: OverflowListTypes.OverflowListButtonType,
          props: any
        ) => {
          if (type === 'dropdown') {
            const selectedInDropdown = offset < items.length && selectedHidden;
            return (
              <NavSelectItem
                {...props}
                active={Boolean(selectedInDropdown)}
                className={classNames(
                  props.className,
                  cssStyles.listItem,
                  cssStyles.dropdown
                )}
              >
                {selectedInDropdown && selectedHidden && selectedHidden.title}
                <Icon as={BiCaretDownFill} />
              </NavSelectItem>
            );
          }
          return null;
        }}
      />
    </Box>
  );
}
