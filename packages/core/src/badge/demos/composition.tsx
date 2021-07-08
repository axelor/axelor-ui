/**
 * @title Composition
 */
import React from 'react';
import { Box, Badge, Button } from '@axelor-ui/core';

export default () => {
  return (
    <Box>
      <Button m={1} variant="primary">
        Notifications <Badge>10</Badge>
      </Button>

      <Button m={1} variant="secondary">
        Notifications <Badge>10</Badge>
      </Button>

      <Button m={1} variant="success">
        Notifications <Badge>10</Badge>
      </Button>

      <Button m={1} variant="danger">
        Notifications <Badge>10</Badge>
      </Button>

      <Button m={1} variant="warning">
        Notifications <Badge>10</Badge>
      </Button>

      <Button m={1} variant="info">
        Notifications <Badge>10</Badge>
      </Button>

      <Button m={1} variant="light">
        Notifications <Badge>10</Badge>
      </Button>

      <Button m={1} variant="dark">
        Notifications <Badge>10</Badge>
      </Button>
    </Box>
  );
};
