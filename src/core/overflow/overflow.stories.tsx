import type { Meta } from "@storybook/react";

import { useState } from "react";
import { Box } from "../box";
import { Button } from "../button";
import { useRefs } from "../hooks";
import { Menu, MenuItem } from "../menu";

import { useIsOverflowItemVisible, useOverflowMenu } from "./hooks";
import { Overflow } from "./overflow";
import { OverflowItem, OverflowItemProps } from "./overflow-item";

const meta = {
  title: "Components/Overflow",
  component: Overflow,
} satisfies Meta<typeof Overflow>;

export default meta;

const itemIds = new Array(12).fill(0).map((_, i) => i.toString());

export const Basic = () => {
  return (
    <Overflow>
      <Box
        p={2}
        d="flex"
        flex={1}
        flexWrap="nowrap"
        border
        overflow="hidden"
        style={{ minWidth: 0, width: 400, resize: "horizontal" }}
      >
        {itemIds.map((i) => (
          <OverflowItem key={i} id={i}>
            <Box px={1}>
              <Button textWrap={false} variant="secondary">
                Item {i}
              </Button>
            </Box>
          </OverflowItem>
        ))}
        <Box px={1}>
          <OverflowMenu itemIds={itemIds} />
        </Box>
      </Box>
    </Overflow>
  );
};

const OverflowMenuItem: React.FC<Pick<OverflowItemProps, "id">> = (props) => {
  const { id } = props;
  const isVisible = useIsOverflowItemVisible(id);

  if (isVisible) {
    return null;
  }

  // As an union between button props and div props may be conflicting, casting is required
  return <MenuItem>Item {id}</MenuItem>;
};

const OverflowMenu: React.FC<{ itemIds: string[] }> = ({ itemIds }) => {
  const { ref, overflowCount, isOverflowing } =
    useOverflowMenu<HTMLButtonElement>();

  const [show, setShow] = useState(false);
  const [target, setTarget] = useState<HTMLButtonElement | null>(null);

  const buttonRef = useRefs(ref, (el: HTMLButtonElement | null) => {
    setTarget(el);
  });

  function showMenu() {
    setShow(true);
  }

  function hideMenu() {
    setShow(false);
  }

  if (!isOverflowing) {
    return null;
  }

  return (
    <Box>
      <Button
        ref={buttonRef}
        onClick={showMenu}
        variant="primary"
        textWrap={false}
      >
        +{overflowCount} items
      </Button>
      <Menu target={target} show={show} onHide={hideMenu} navigation>
        {itemIds.map((i) => {
          return <OverflowMenuItem key={i} id={i} />;
        })}
      </Menu>
    </Box>
  );
};
