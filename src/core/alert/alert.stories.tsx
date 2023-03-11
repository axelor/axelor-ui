import { Box } from '../box';
import { Icon } from '../icon';
import { Alert, AlertHeader, AlertLink } from './alert';

import { ReactComponent as BiExclamation } from 'bootstrap-icons/icons/exclamation-circle-fill.svg';
import { ReactComponent as BiClose } from 'bootstrap-icons/icons/x.svg';

const config = {
  component: Alert,
  title: 'Components/Alert',
};

export const Basic = () => {
  return (
    <Box>
      <Alert>This is a simple alert...</Alert>
      <Alert variant="warning">
        <AlertHeader>Warning!</AlertHeader>
        This is a alert with title...
      </Alert>
      <Alert variant="danger">
        <Box alignItems="center" d="flex" g={2}>
          <Icon as={BiExclamation} />
          <Box>
            This is an <AlertLink href="/">alert with</AlertLink> icon...
          </Box>
        </Box>
      </Alert>
      <Alert variant="success">
        <Box alignItems="center" d="flex" g={2}>
          <Box flex={1}>This is an alert with close icon...</Box>
          <Icon as={BiClose} cursor="pointer" />
        </Box>
      </Alert>
    </Box>
  );
};

export default config;
