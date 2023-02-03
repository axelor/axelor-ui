import React from 'react';
import { ReactComponent as BiCaretDownFill } from 'bootstrap-icons/icons/caret-down-fill.svg';

import { Box } from '../box/box';
import { Icon } from '../icon';
import {
  OverflowList,
  OverflowListButtonType,
  OverflowListItemProps,
} from '../overflow-list';
import { MenuItem } from '../menu/menu-item';
import { MenuProps } from '../menu/menu';
import { useClassNames, useTheme } from '../styles';
import { withStyled } from '../styled';
import classes from './nav-select.module.scss';

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

export interface NavSelectItemProps {
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
        [classes.active]: Boolean(active),
        [classes[dir]]: dir,
      })}
    >
      <a {...{}}>{children}</a>
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
  const rtl = useTheme().dir === 'rtl';

  return (
    <Box
      className={classNames('nav-select', classes.root, {
        [classes.rtl]: rtl,
      })}
    >
      <OverflowList
        items={items}
        className={classes.list}
        dropdownRef={overflowDropdown}
        dropdownMenuProps={menuConfig}
        {...(selected
          ? {
              onOverflowChange: setOffset,
            }
          : {})}
        renderListItem={(_item: OverflowListItemProps, index: number) => {
          const item = _item as TNavSelectItem;
          return (
            <NavSelectItem
              key={index}
              active={item.value === selected?.value}
              className={classNames(classes.listItem, {
                [classes.last]: index === items.length - 1,
              })}
              onClick={() => handleItemClick(item)}
            >
              {item.title}
            </NavSelectItem>
          );
        }}
        renderOverflow={(
          items: OverflowListItemProps[],
          closeDropdown?: () => void
        ) => {
          return (items as TNavSelectItem[]).map((item, index) => {
            return (
              <MenuItem
                key={index}
                as="button"
                d="flex"
                justifyContent="center"
                className={classNames(classes.overflowListItem, {
                  [classes.active]: item.value === selected?.value,
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
        renderButton={(type: OverflowListButtonType, props: any) => {
          if (type === 'dropdown') {
            const selectedInDropdown = offset < items.length && selectedHidden;
            return (
              <NavSelectItem
                {...props}
                active={Boolean(selectedInDropdown)}
                className={classNames(props.className, classes.dropdown)}
              >
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
