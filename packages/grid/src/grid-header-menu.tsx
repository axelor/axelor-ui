import React from 'react';
import { Box, Input, Menu, MenuItem, Icon } from '@axelor-ui/core';
import { ReactComponent as BiThreeDotsVertical } from 'bootstrap-icons/icons/three-dots-vertical.svg';

import { GridHeaderColumnProps } from './grid-header-column';
import * as TYPES from './types';
import styles from './grid.module.css';

export interface GridHeaderMenuProps {
  columns?: TYPES.GridColumn[];
  onColumnShow?: GridHeaderColumnProps['onShow'];
  onColumnHide?: GridHeaderColumnProps['onHide'];
}

export const GridHeaderMenu = React.memo(function GridHeaderMenu({
  columns = [],
  onColumnShow,
  onColumnHide,
}: GridHeaderMenuProps) {
  const [showColumnOptions, setColumnOptions] = React.useState(false);
  const [columnOptionsTarget, setColumnOptionsTarget] =
    React.useState<HTMLElement | null>(null);
    
  return (
    <>
      <Box
        ref={setColumnOptionsTarget}
        className={styles.columnOptions}
        onClick={() => setColumnOptions(true)}
      >
        <Icon as={BiThreeDotsVertical} />
      </Box>
      <Menu
        navigation
        target={columnOptionsTarget}
        show={showColumnOptions}
        onHide={() => setColumnOptions(false)}
      >
        {columns
          .filter(c => c.title)
          .map(column => {
            const { visible = true } = column;
            function toggle(e: React.SyntheticEvent) {
              visible && onColumnHide && onColumnHide(e, column);
              !visible && onColumnShow && onColumnShow(e, column);
            }
            return (
              <MenuItem
                key={column.name}
                onClick={toggle}
                onKeyDown={e => {
                  e.preventDefault();
                  if (e.key === 'Enter') {
                    toggle(e);
                  }
                }}
              >
                <Input type="checkbox" checked={visible} onChange={() => {}} />
                <Box as="span" ms={2}>
                  {column.title}
                </Box>
              </MenuItem>
            );
          })}
      </Menu>
    </>
  );
});
