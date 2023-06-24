import type { Meta, StoryObj } from "@storybook/react";

import { Panel } from "./panel";

const meta = {
  title: "Components/Panel",
  component: Panel,
} satisfies Meta<typeof Panel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    style: {
      width: 300,
      maxHeight: 300,
    },
    children: (
      <>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur
          aut ut quod, magnam expedita aperiam nam, sed quam autem obcaecati
          sequi illum possimus architecto dolores rerum maiores beatae quos
          excepturi!
        </p>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste quaerat
          enim suscipit quod deserunt reprehenderit dolorem, rerum nulla dicta
          eos aut? Recusandae autem, esse numquam placeat sapiente nisi
          explicabo voluptatibus?
        </p>
      </>
    ),
    header: "Hello",
    toolbar: {
      items: [
        {
          key: "add",
          iconProps: {
            icon: "add",
          },
        },
        {
          key: "del",
          iconProps: {
            icon: "delete",
          },
        },
      ],
    },
    footer: "Some status..."
  },
};

export const Collapsible: Story = {
  ...Basic,
  args: {
    ...Basic.args,
    collapsible: true,
  },
};
