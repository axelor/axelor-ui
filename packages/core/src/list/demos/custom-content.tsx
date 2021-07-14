/**
 * @title Custom Content
 */
import React from 'react';
import { Box, List, ListItem } from '@axelor-ui/core';

const content = (
  <>
    <Box d="flex" w={100} justifyContent="between">
      <Box as="h5" mb={1}>
        Lorem ipsum dolor
      </Box>
      <Box as="small" color="muted">
        sit amet
      </Box>
    </Box>
    <Box as="p" mb={1}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a ultrices
      velit.
    </Box>
    <Box as="small" color="muted">
      Fusce a ultrices velit.
    </Box>
  </>
);

export default () => {
  return (
    <List>
      <ListItem active>
        <Box d="flex" w={100} justifyContent="between">
          <Box as="h5" mb={1}>
            Lorem ipsum dolor
          </Box>
          <small>sit amet</small>
        </Box>
        <Box as="p" mb={1}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a
          ultrices velit.
        </Box>
        <small>Fusce a ultrices velit.</small>
      </ListItem>
      <ListItem>{content}</ListItem>
      <ListItem>{content}</ListItem>
    </List>
  );
};
