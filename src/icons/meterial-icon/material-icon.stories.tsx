import { useState } from "react";
import { Box, Button, Input, InputLabel } from "../../core";
import { MaterialIcon, MaterialIconProps } from "./material-icon";

const config = {
  component: MaterialIcon,
  title: "Icons/Material",
};

const IconBox = (props: MaterialIconProps) => {
  const { icon } = props;
  return (
    <Box
      bg="light"
      rounded
      d="flex"
      flexDirection="column"
      alignItems="center"
      g={1}
      p={3}
    >
      <MaterialIcon {...props} />
      <span>{icon}</span>
    </Box>
  );
};

const GRADES = [-25, 0, 200];
const SIZES = [20, 24, 40, 48];

export const Basic = () => {
  const [fill, setFill] = useState<any>(0);
  const [weight, setWeight] = useState<any>(400);
  const [grade, setGrade] = useState<any>(0);
  const [size, setSize] = useState<any>(48);

  const handleFillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = +e.target.value;
    setFill(value);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = +e.target.value;
    setWeight(value);
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = +e.target.value;
    setGrade(GRADES[value]);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = +e.target.value;
    setSize(SIZES[value]);
  };

  const handleReset = () => {
    setFill(0);
    setWeight(400);
    setGrade(0);
    setSize(48);
  };

  return (
    <Box
      d="flex"
      g={2}
      alignItems="flex-start"
      flexFlow="row-reverse"
      justifyContent="start"
    >
      <Box d="flex" g={2}>
        <IconBox
          icon="search"
          fill={fill}
          weight={weight}
          grade={grade}
          opticalSize={size}
        />
        <IconBox
          icon="home"
          fill={fill}
          weight={weight}
          grade={grade}
          opticalSize={size}
        />
        <IconBox
          icon="menu"
          fill={fill}
          weight={weight}
          grade={grade}
          opticalSize={size}
        />
        <IconBox
          icon="close"
          fill={fill}
          weight={weight}
          grade={grade}
          opticalSize={size}
        />
        <IconBox
          icon="settings"
          fill={fill}
          weight={weight}
          grade={grade}
          opticalSize={size}
        />
        <IconBox
          icon="expand_more"
          fill={fill}
          weight={weight}
          grade={grade}
          opticalSize={size}
        />
        <IconBox
          icon="done"
          fill={fill}
          weight={weight}
          grade={grade}
          opticalSize={size}
        />
      </Box>
      <Box d="flex" flexDirection="column" g={2} bg="light" rounded p={3}>
        <Box>
          <InputLabel>Fill: {fill}</InputLabel>
          <Input
            type="range"
            min={0}
            max={1}
            value={fill}
            onChange={handleFillChange}
          />
        </Box>
        <Box>
          <InputLabel>Weight: {weight}</InputLabel>
          <Input
            type="range"
            min={100}
            max={700}
            step={100}
            value={weight}
            onChange={handleWeightChange}
          />
        </Box>
        <Box>
          <InputLabel>Grade: {grade}</InputLabel>
          <Input
            type="range"
            min={0}
            max={2}
            value={GRADES.indexOf(grade)}
            onChange={handleGradeChange}
          />
        </Box>
        <Box>
          <InputLabel>Optical Size: {size}</InputLabel>
          <Input
            type="range"
            min={0}
            max={3}
            value={SIZES.indexOf(size)}
            onChange={handleSizeChange}
          />
        </Box>
        <Button variant="primary" onClick={handleReset}>
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default config;
