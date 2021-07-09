/**
 * @title Flush
 */
import React from 'react';
import { List, ListItem } from '@axelor-ui/core';

export default () => {
  return (
    <List flush>
      <ListItem>An item</ListItem>
      <ListItem>A second item</ListItem>
      <ListItem>A third item</ListItem>
      <ListItem>A fourth item</ListItem>
      <ListItem>And a fifth one</ListItem>
    </List>
  );
};
