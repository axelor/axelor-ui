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
            id: "new",
            title: "New",
            iconProps: {
              icon: "add",
            },
          },
          {
            id: "edit",
            title: "Edit",
          },

          {
            id: "delete",
            title: "Delete",
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
        ]}
      />
    </div>
  );
};

export default config;
