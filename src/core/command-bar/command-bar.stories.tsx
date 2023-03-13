import { CommandBar } from "./command-bar";

const config = {
  component: CommandBar,
  title: "Components/CommandBar",
};

export const Basic = () => {
  return (
    <div>
      <CommandBar
        iconProps={{
          weight: 300,
        }}
        items={[
          {
            id: "new",
            title: "New",
            iconProps: {
              icon: "add",
            },
          },
          {
            id: "edit",
            title: "Edit",
            iconProps: {
              icon: "edit",
            },
          },
          {
            id: "save",
            title: "Save",
            iconProps: {
              icon: "save",
            },
          },
          {
            id: "delete",
            title: "Delete",
            iconProps: {
              icon: "delete",
            },
            onClick: () => {},
            items: [
              {
                id: "archive",
                title: "Archive",
              },
              {
                id: "deleteAll",
                title: "Delete all...",
              },
            ],
          },
          {
            id: "more",
            iconProps: {
              icon: "more_vert",
            },
            items: [
              {
                id: "about",
                title: "About",
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default config;
