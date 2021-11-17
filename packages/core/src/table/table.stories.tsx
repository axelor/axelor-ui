import React from 'react';
import { Box } from '../box';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFoot,
  TableHead,
  TableRow,
} from '../table';

export default {
  component: Table,
  title: 'Components/Table',
};

export const Active = () => {
  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell as="th">#</TableCell>
            <TableCell as="th">First</TableCell>
            <TableCell as="th">Last</TableCell>
            <TableCell as="th">Handle</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow selected>
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
            <TableCell selected colSpan={2}>
              Larry the Bird
            </TableCell>
            <TableCell>@twitter</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};

export const Basic = () => {
  return (
    <Table>
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
    </Table>
  );
};

export const Border = () => {
  return (
    <Box>
      <Table bordered>
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
      </Table>
    </Box>
  );
};

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

export const Caption = () => {
  return (
    <Box>
      <Block label="Bottom Placement">
        <Table>
          {content}
          <TableCaption>List of users</TableCaption>
        </Table>
      </Block>
      <Block label="Top Placement">
        <Table>
          {content}
          <TableCaption placement="top">List of users</TableCaption>
        </Table>
      </Block>
    </Box>
  );
};

export const Colors = () => {
  return (
    <Box>
      <Table>
        <TableHead color="danger">
          <TableRow>
            <TableCell as="th" colSpan={3}>
              Header
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Default</TableCell>
            <TableCell>Cell</TableCell>
            <TableCell>Cell</TableCell>
          </TableRow>
          <TableRow color="primary">
            <TableCell>Primary</TableCell>
            <TableCell>Cell</TableCell>
            <TableCell>Cell</TableCell>
          </TableRow>
          <TableRow color="secondary">
            <TableCell>Secondary</TableCell>
            <TableCell>Cell</TableCell>
            <TableCell>Cell</TableCell>
          </TableRow>
          <TableRow color="success">
            <TableCell>Success</TableCell>
            <TableCell>Cell</TableCell>
            <TableCell>Cell</TableCell>
          </TableRow>
          <TableRow color="danger">
            <TableCell>Danger</TableCell>
            <TableCell>Cell</TableCell>
            <TableCell>Cell</TableCell>
          </TableRow>
          <TableRow color="warning">
            <TableCell>Warning</TableCell>
            <TableCell>Cell</TableCell>
            <TableCell>Cell</TableCell>
          </TableRow>
          <TableRow color="info">
            <TableCell>Info</TableCell>
            <TableCell>Cell</TableCell>
            <TableCell>Cell</TableCell>
          </TableRow>
          <TableRow color="light">
            <TableCell>Light</TableCell>
            <TableCell>Cell</TableCell>
            <TableCell>Cell</TableCell>
          </TableRow>
          <TableRow color="dark">
            <TableCell>Dark</TableCell>
            <TableCell>Cell</TableCell>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
        <TableFoot color="info">
          <TableRow>
            <TableCell as="th" colSpan={3}>
              Footer
            </TableCell>
          </TableRow>
        </TableFoot>
      </Table>
    </Box>
  );
};

export const Footer = () => {
  return (
    <Table>
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
          <TableCell>Larry</TableCell>
          <TableCell>the Bird</TableCell>
          <TableCell>@twitter</TableCell>
        </TableRow>
      </TableBody>
      <TableFoot>
        <TableRow>
          <TableCell>Footer</TableCell>
          <TableCell>Footer</TableCell>
          <TableCell>Footer</TableCell>
          <TableCell>Footer</TableCell>
        </TableRow>
      </TableFoot>
    </Table>
  );
};

export const Hover = () => {
  return (
    <Box>
      <Table hover>
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
      </Table>
    </Box>
  );
};

export const Size = () => {
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

export const Striped = () => {
  return (
    <Box>
      <Table striped>
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
      </Table>
    </Box>
  );
};
