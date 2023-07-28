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
            disabled: true,
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
            key: "Menu 1",
            text: "Menu 1",
            showDownArrow: true,
            items: [
              {
                key: "Menu 1.1",
                text: "Menu 1.1",
                items: [
                  {
                    key: "Menu 1.1.1",
                    text: "Menu 1.1.1",
                    items: [
                      {
                        key: "Menu 1.1.1.1",
                        text: "Menu 1.1.1.1",
                      },
                      {
                        key: "Menu 1.1.1.2",
                        text: "Menu 1.1.1.2",
                      },
                    ],
                  },
                  {
                    key: "Menu 1.1.2",
                    text: "Menu 1.1.2",
                  },
                ],
              },
              {
                key: "Menu 1.2",
                text: "Menu 1.2",
              },
              {
                key: "Menu 1.3",
                text: "Menu 1.3",
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
