/**
 * @title Size
 */
import React from 'react';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@axelor-ui/core';

const content = (
  <>
    <TableHead>
      <TableRow>
        <TableCell as="th">#</TableCell>
        <TableCell as="th">First</TableCell>
        <TableCell as="th">Last</TableCell>
        <TableCell as="th">Handle</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell as="th">1</TableCell>
        <TableCell>Mark</TableCell>
        <TableCell>Otto</TableCell>
        <TableCell>@mdo</TableCell>
      </TableRow>
      <TableRow>
        <TableCell as="th">2</TableCell>
        <TableCell>Jacob</TableCell>
        <TableCell>Thornton</TableCell>
        <TableCell>@fat</TableCell>
      </TableRow>
      <TableRow>
        <TableCell as="th">3</TableCell>
        <TableCell colSpan={2}>Larry the Bird</TableCell>
        <TableCell>@twitter</TableCell>
      </TableRow>
    </TableBody>
  </>
);

function Block({ label, children }: any) {
  return (
    <>
      <Box mt={4} bg="secondary" color="white" ps={1}>
        {label}
      </Box>
      <Box mt={2}>{children}</Box>
    </>
  );
}

export default () => {
  return (
    <Box>
      <Block label="sm Size">
        <Table size="sm">{content}</Table>
      </Block>
      <Block label="md Size">
        <Table size="md">{content}</Table>
      </Block>
    </Box>
  );
};
