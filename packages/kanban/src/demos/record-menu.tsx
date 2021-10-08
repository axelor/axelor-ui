/**
 * @title Record Menu
 */
import React, { useCallback, useContext, useState } from 'react';
import {
  Box,
  Button,
  Icon,
  Popper,
  ClickAwayListener,
  List,
  ListItem,
} from '@axelor-ui/core';
import { RecordRenderer } from '../types';

import Basic from './basic';
import { getId, getTitle } from './data';
import { useMemo } from 'react';

const StoreContext = React.createContext<{
  onEdit(value: any): void;
  onDelete(value: any): void;
}>({ onEdit: () => null, onDelete: () => null });

const Record: RecordRenderer = ({ record, column }) => {
  const [open, setOpen] = useState(false);
  const [targetEl, setTargetEl] = useState<HTMLButtonElement | null>(null);

  const toggle = () => setOpen(v => !v);

  const { onEdit, onDelete } = useContext(StoreContext);

  const handleEdit = () => {
    onEdit({ column, record });
    setOpen(false);
  };
  const handleDelete = () => {
    onDelete({ column, record });
    setOpen(false);
  };

  return (
    <Box p={2} mt={2} shadow="sm" rounded bg="white">
      <Box pb={1} pt={1} d="flex" justifyContent="space-between">
        <Box as="p">{record.title}</Box>
        <Button ref={setTargetEl} onClick={toggle} d="inline-flex">
          <Icon use="caret-down-fill" />
        </Button>
        <Popper open={open} target={targetEl} offset={[0, 4]}>
          <ClickAwayListener onClickAway={toggle}>
            <List>
              <ListItem onClick={handleEdit}>Edit</ListItem>
              <ListItem onClick={handleDelete}>Delete</ListItem>
            </List>
          </ClickAwayListener>
        </Popper>
      </Box>
    </Box>
  );
};

function RecordRendererDemo() {
  const onEdit = useCallback(() => alert('edit'), []);
  const onDelete = useCallback(() => alert('delete'), []);

  const value = useMemo(() => ({ onDelete, onEdit }), [onDelete, onEdit]);

  return (
    <StoreContext.Provider value={value}>
      <Basic
        columns={[
          {
            id: getId(),
            title: 'Todo',
            records: [{ id: getId(), title: getTitle(), renderer: Record }],
          },
        ]}
      />
    </StoreContext.Provider>
  );
}

export default RecordRendererDemo;
