import type { Meta, StoryObj } from "@storybook/react";

import { Decorate } from "./decorate";

const meta = {
  title: "Core/Decorate",
  component: Decorate,
} satisfies Meta<typeof Decorate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    classes: "border rounded p-2",
    children: <div>Welcome!!!</div>,
  },
};

export const Buttons = () => {
  return (
    <Decorate classes="d-flex gap-2">
      <div>
        <Decorate classes="btn btn-primary">
          <button type="button">Primary</button>
        </Decorate>
        <Decorate classes="btn btn-secondary">
          <button type="button">Secondary</button>
        </Decorate>
        <Decorate classes="btn btn-success">
          <button type="button">Success</button>
        </Decorate>
        <Decorate classes="btn btn-warning">
          <button type="button">Warning</button>
        </Decorate>
        <Decorate classes="btn btn-danger">
          <button type="button">Danger</button>
        </Decorate>
        <Decorate classes="btn btn-info">
          <button type="button">Info</button>
        </Decorate>
        <Decorate classes="btn btn-light">
          <button type="button">Light</button>
        </Decorate>
        <Decorate classes="btn btn-dark">
          <button type="button">Dark</button>
        </Decorate>
        <Decorate classes="btn btn-link">
          <button type="button">Link</button>
        </Decorate>
      </div>
    </Decorate>
  );
};
