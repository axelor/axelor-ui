import type { Meta, StoryObj } from "@storybook/react";

import { Block } from "./block";

const meta = {
  title: "Layout/Block",
  component: Block,
} satisfies Meta<typeof Block>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    classes: "border rounded p-2",
    children: <div>Welcome!!!</div>,
  },
};
