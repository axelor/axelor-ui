import type { Meta } from "@storybook/react";

import { Box } from "../box";
import { Button } from "../button";
import { OverflowList } from "./overflow-list";

const meta = {
  title: "Components/OverflowList",
  component: OverflowList,
} satisfies Meta<typeof OverflowList>;

export default meta;

const items = new Array(12).fill(0).map((_, i) => ({
  id: i.toString(),
  text: `Item ${i}`,
}));

export const Basic = () => {
  return (
    <Box
      p={2}
      border
      overflow="hidden"
      d="flex"
      style={{
        minWidth: 0,
        width: 400,
        resize: "horizontal",
      }}
    >
      <OverflowList
        items={items}
        renderItem={({ item }) => (
          <Button variant="secondary" m={1}>
            {item.text}
          </Button>
        )}
        renderMenuTrigger={({ count }) => (
          <Button variant="primary" m={1}>
            +{count}
          </Button>
        )}
        renderMenuItem={({ item }) => <div>{item.text}</div>}
        menuProps={{
          arrow: true,
        }}
      />
    </Box>
  );
};

export const Vertical = () => {
  return (
    <Box
      p={2}
      border
      overflow="hidden"
      d="flex"
      style={{
        minHeight: 0,
        width: 100,
        height: 400,
        resize: "vertical",
      }}
    >
      <OverflowList
        items={items}
        renderItem={({ item }) => (
          <Button variant="secondary" m={1}>
            {item.text}
          </Button>
        )}
        renderMenuTrigger={({ count }) => (
          <Button variant="primary" m={1}>
            +{count}
          </Button>
        )}
        renderMenuItem={({ item }) => <div>{item.text}</div>}
        menuProps={{
          arrow: true,
        }}
        overflowProps={{
          overflowAxis: "vertical",
        }}
      />
    </Box>
  );
};
