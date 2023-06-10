import { Box } from "../box";
import { Link } from "./link";

const config = {
  component: Link,
  title: "Components/Link",
};

export const Basic = () => {
  return (
    <Box>
      <Link href="#" onClick={() => console.log("Link Clicked")}>
        Link
      </Link>
    </Box>
  );
};

export const Colored = () => {
  return (
    <Box d="flex" flexDirection="column" g={3}>
      <Link href="#" color="primary">
        Primary link
      </Link>{" "}
      <Link href="#" color="secondary">
        Secondary link
      </Link>{" "}
      <Link href="#" color="success">
        Success link
      </Link>{" "}
      <Link href="#" color="danger">
        Danger link
      </Link>{" "}
      <Link href="#" color="warning">
        Warning link
      </Link>{" "}
      <Link href="#" color="info">
        Info link
      </Link>{" "}
      <Link href="#" color="light">
        Light link
      </Link>{" "}
      <Link href="#" color="dark">
        Dark link
      </Link>
    </Box>
  );
};

export const Underlined = () => {
  return (
    <Box d="flex" flexDirection="column" g={3}>
      <Link href="#" underline>
        Link with underline
      </Link>
      <Link href="#" underline={false}>
        Link without underline
      </Link>
    </Box>
  );
};

export const Offset = () => {
  return (
    <Box>
      <Link href="#" offset={2}>
        Link
      </Link>
    </Box>
  );
};

export default config;
