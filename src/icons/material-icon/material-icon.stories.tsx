import { useState } from "react";
import { Box, Input, InputLabel } from "../../core";
import { MaterialIcon, MaterialIconProps } from "./material-icon";

const config = {
  component: MaterialIcon,
  title: "Icons/Material",
};

const IconBox = (props: MaterialIconProps) => {
  const { icon } = props;
  return (
    <Box
      bg="body-tertiary"
      rounded
      d="flex"
      flexDirection="column"
      alignItems="center"
      g={1}
      p={3}
    >
      <MaterialIcon {...props} fontSize={24} />
      <span>{icon}</span>
    </Box>
  );
};

export const Basic = () => {
  const [fill, setFill] = useState(false);

  const handleFillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFill(!fill);
  };

  return (
    <Box
      d="flex"
      flexDirection="column"
      g={2}
      alignItems="flex-start"
      justifyContent="start"
    >
      <Box d="flex" g={2}>
        <IconBox icon="search" fill={fill} />
        <IconBox icon="home" fill={fill} />
        <IconBox icon="menu" fill={fill} />
        <IconBox icon="close" fill={fill} />
        <IconBox icon="settings" fill={fill} />
        <IconBox icon="keyboard_arrow_down" fill={fill} />
        <IconBox icon="check" fill={fill} />
      </Box>
      <Box d="flex" g={2}>
        <Input
          id="fill"
          type="checkbox"
          checked={fill}
          onChange={handleFillChange}
        />
        <InputLabel htmlFor="fill">Fill</InputLabel>
      </Box>
    </Box>
  );
};

export default config;
