import { MaterialIcon } from "../../icons/material-icon";
import { Box } from "../box";
import { Alert, AlertHeader, AlertLink } from "./alert";

const config = {
  component: Alert,
  title: "Components/Alert",
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
          <MaterialIcon icon="exclamation" />
          <Box>
            This is an <AlertLink href="/">alert with</AlertLink> icon...
          </Box>
        </Box>
      </Alert>
      <Alert variant="success">
        <Box alignItems="center" d="flex" g={2}>
          <Box flex={1}>This is an alert with close icon...</Box>
          <MaterialIcon icon="close" />
        </Box>
      </Alert>
    </Box>
  );
};

export default config;
