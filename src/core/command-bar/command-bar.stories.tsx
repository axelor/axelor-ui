import { CommandBar } from "./command-bar";

const config = {
  component: CommandBar,
  title: "Components/CommandBar",
};

export const Basic = () => {
  return (
    <div>
      <CommandBar
        items={[
          {
            key: "new",
            text: "New",
            iconProps: {
              icon: "add",
            },
          },
          {
            key: "edit",
            text: "Edit",
            iconProps: {
              icon: "edit",
            },
          },
          {
            key: "save",
            text: "Save",
            iconProps: {
              icon: "save",
            },
          },
          {
            key: "delete",
            text: "Delete",
            iconProps: {
              icon: "delete",
            },
            onClick: () => {},
            items: [
              {
                key: "archive",
                text: "Archive",
              },
              {
                key: "deleteAll",
                text: "Delete all...",
              },
            ],
          },
          {
            key: "more",
            iconProps: {
              icon: "more_vert",
            },
            items: [
              {
                key: "about",
                text: "About",
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export const Rounded = () => {
  return (
    <div>
      <CommandBar
        menuProps={{
          arrow: true,
          rounded: true,
        }}
        items={[
          {
            key: "new",
            text: "New",
            iconProps: {
              icon: "add",
            },
          },
          {
            key: "edit",
            text: "Edit",
            iconProps: {
              icon: "edit",
            },
          },
          {
            key: "save",
            text: "Save",
            iconProps: {
              icon: "save",
            },
          },
          {
            key: "delete",
            text: "Delete",
            iconProps: {
              icon: "delete",
            },
            onClick: () => {},
            items: [
              {
                key: "archive",
                text: "Archive",
              },
              {
                key: "deleteAll",
                text: "Delete all...",
              },
            ],
          },
          {
            key: "more",
            iconProps: {
              icon: "more_vert",
            },
            items: [
              {
                key: "about",
                text: "About",
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default config;
