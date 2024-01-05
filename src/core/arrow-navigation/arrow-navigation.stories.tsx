import { useState, useCallback } from "react";

import { Box } from "../box";
import { Button } from "../button";
import { ArrowNavigation } from "./arrow-navigation";
import styled from "../styled";

const config = {
  component: ArrowNavigation,
  title: "Core/ArrowNavigation",
};

const CustomButton = styled(Button)(
  ({ m = 1, variant = "primary", style }) => ({
    m,
    variant,
    style: { width: 75, ...style },
  }),
);

export const Basic = function () {
  const [box, setBox] = useState<HTMLElement | null>(null);

  const selector: any = useCallback(() => {
    if (box) {
      return [
        box.querySelectorAll("div:nth-child(1) > button"),
        box.querySelectorAll("div:nth-child(2) > button"),
        box.querySelectorAll("div:nth-child(3) > button"),
        box.querySelectorAll("div:nth-child(4) > button"),
      ];
    }
    return [];
  }, [box]);

  return (
    <ArrowNavigation selector={selector}>
      <Box ref={setBox} d="flex" flexDirection="column">
        <Box d="flex">
          <CustomButton>1</CustomButton>
          <CustomButton>2</CustomButton>
          <CustomButton>3</CustomButton>
          <CustomButton>.</CustomButton>
        </Box>
        <Box d="flex">
          <CustomButton>4</CustomButton>
          <CustomButton>5</CustomButton>
          <CustomButton>6</CustomButton>
          <CustomButton disabled>C</CustomButton>
          <CustomButton>DEL</CustomButton>
        </Box>
        <Box d="flex">
          <CustomButton>7</CustomButton>
          <CustomButton>8</CustomButton>
          <CustomButton>9</CustomButton>
          <CustomButton>=</CustomButton>
          <CustomButton>00</CustomButton>
        </Box>
        <Box d="flex">
          <CustomButton>0</CustomButton>
          <CustomButton style={{ visibility: "hidden" }}>0</CustomButton>
          <CustomButton style={{ visibility: "hidden" }}>0</CustomButton>
          <CustomButton>(</CustomButton>
          <CustomButton>)</CustomButton>
        </Box>
      </Box>
    </ArrowNavigation>
  );
};

export const Horizontal = function () {
  return (
    <ArrowNavigation selector={"auto-horizontal"}>
      <Box d="flex" flexDirection="row">
        <CustomButton>Item 1</CustomButton>
        <CustomButton>Item 2</CustomButton>
        <CustomButton>Item 3</CustomButton>
        <CustomButton style={{ visibility: "hidden" }}>Item 4</CustomButton>
        <CustomButton>Item 5</CustomButton>
        <CustomButton>Item 6</CustomButton>
        <CustomButton style={{ display: "none" }}>Item 7</CustomButton>
      </Box>
    </ArrowNavigation>
  );
};

export const Vertical = function () {
  return (
    <ArrowNavigation selector={"auto-vertical"}>
      <Box d="flex" flexDirection="column">
        <CustomButton>Item 1</CustomButton>
        <CustomButton>Item 2</CustomButton>
        <CustomButton disabled>Item 3</CustomButton>
        <CustomButton>Item 4</CustomButton>
        <CustomButton>Item 5</CustomButton>
        <CustomButton>Item 6</CustomButton>
      </Box>
    </ArrowNavigation>
  );
};

export default config;
