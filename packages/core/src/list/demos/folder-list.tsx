/**
 * @title Folder List
 */
import React from 'react';
import { Box, Icon, List, ListItem } from '@axelor-ui/core';

export default () => {
  return (
    <List>
      {['archive', 'card-image', 'bank'].map(icon => (
        <ListItem key={icon}>
          <Box d="flex" alignItems="center">
            <Box
              me={2}
              p={2}
              bg="secondary"
              color="white"
              rounded="circle"
              d="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon use={icon} />
            </Box>
            <Box>
              <Box as="p" mb={0}>
                Lorem ipsum
              </Box>
              <Box as="small" color="muted">
                et al dolor el
              </Box>
            </Box>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};
