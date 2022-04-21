import { Box } from '../box';
import { Badge as BadgeComponent } from '../badge';
import { Button } from '../button';

const Badge = (props: any) => <BadgeComponent bg="secondary" {...props} />;

export const Basic = () => {
  return (
    <Box>
      <h1>
        Example heading <Badge>New</Badge>
      </h1>
      <h2>
        Example heading <Badge>New</Badge>
      </h2>
      <h3>
        Example heading <Badge>New</Badge>
      </h3>
      <h4>
        Example heading <Badge>New</Badge>
      </h4>
      <h5>
        Example heading <Badge>New</Badge>
      </h5>
      <h6>
        Example heading <Badge>New</Badge>
      </h6>
    </Box>
  );
};

export const Colors = () => {
  return (
    <Box>
      <Badge m={1} bg="primary">
        Primary
      </Badge>

      <Badge m={1} bg="secondary">
        Secondary
      </Badge>

      <Badge m={1} bg="success">
        Success
      </Badge>

      <Badge m={1} bg="danger">
        Danger
      </Badge>

      <Badge m={1} bg="warning" color="dark">
        Warning
      </Badge>

      <Badge m={1} bg="info" color="dark">
        Info
      </Badge>

      <Badge m={1} bg="light" color="dark">
        Light
      </Badge>

      <Badge m={1} bg="dark">
        Dark
      </Badge>

      <Box />

      <Badge m={1} bgColor="primary" rounded="pill">
        Primary
      </Badge>

      <Badge m={1} bgColor="secondary" rounded="pill">
        Secondary
      </Badge>

      <Badge m={1} bgColor="success" rounded="pill">
        Success
      </Badge>

      <Badge m={1} bgColor="danger" rounded="pill">
        Danger
      </Badge>

      <Badge m={1} bgColor="warning" rounded="pill" color="dark">
        Warning
      </Badge>

      <Badge m={1} bgColor="info" rounded="pill" color="dark">
        Info
      </Badge>

      <Badge m={1} bgColor="light" rounded="pill" color="dark">
        Light
      </Badge>

      <Badge m={1} bgColor="dark" rounded="pill">
        Dark
      </Badge>
    </Box>
  );
};

export const Composition = () => {
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

export const Variant = () => {
  return (
    <Box>
      <Badge>Default</Badge> <Badge rounded="pill">Pill</Badge>
    </Box>
  );
};

const stories = {
  component: Badge,
  title: 'Components/Badge',
};

export default stories;
