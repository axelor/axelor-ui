import { Box } from '../box';
import { Link } from './link';

export default {
  component: Link,
  title: 'Components/Link',
};

export const Basic = () => {
  return (
    <Box>
      <Link href="#" onClick={() => console.log('Link Clicked')}>
        Link
      </Link>
    </Box>
  );
};

export const Colored = () => {
  return (
    <Box>
      <Link href="#" color="primary">
        Primary link
      </Link>{' '}
      <Link href="#" color="secondary">
        Secondary link
      </Link>{' '}
      <Link href="#" color="success">
        Success link
      </Link>{' '}
      <Link href="#" color="danger">
        Danger link
      </Link>{' '}
      <Link href="#" color="warning">
        Warning link
      </Link>{' '}
      <Link href="#" color="info">
        Info link
      </Link>{' '}
      <Link href="#" color="light">
        Light link
      </Link>{' '}
      <Link href="#" color="dark">
        Dark link
      </Link>
    </Box>
  );
};

export const Underlined = () => {
  return (
    <Box>
      <Link href="#" underline={true}>
        Link
      </Link>
    </Box>
  );
};
