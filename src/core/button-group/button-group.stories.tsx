import { Button } from '../button';
import { ButtonGroup } from '../button-group';

const config = {
  component: ButtonGroup,
  title: 'Components/ButtonGroup',
};

export const Basic = () => {
  return (
    <ButtonGroup>
      <Button variant="primary">One</Button>
      <Button variant="primary">Two</Button>
      <Button variant="primary">Three</Button>
    </ButtonGroup>
  );
};

export const Vertical = () => {
  return (
    <ButtonGroup vertical>
      <Button variant="primary">One</Button>
      <Button variant="primary">Two</Button>
      <Button variant="primary">Three</Button>
    </ButtonGroup>
  );
};

export default config;
