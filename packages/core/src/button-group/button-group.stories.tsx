import { Button } from '../button';
import { ButtonGroup } from '../button-group';
import { ThemeProvider } from '../styles';

export default {
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

export const RTL = () => {
  return (
    <ThemeProvider dir="rtl">
      <div>
        <ButtonGroup>
          <Button variant="primary">One</Button>
          <Button variant="primary">Two</Button>
          <Button variant="primary">Three</Button>
        </ButtonGroup>
      </div>
    </ThemeProvider>
  );
};
