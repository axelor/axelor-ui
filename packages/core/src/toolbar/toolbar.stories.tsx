import React from 'react';
import { Box } from '../box';
import { Icon } from '../icon';
import { ButtonGroup } from '../button-group';
import { Button } from '../button';
import { OverflowList } from '../overflow-list';
import { withStyled } from '../styled';

export default {
  component: OverflowList,
  title: 'Components/Toolbar',
};

type TToolbarItem = {
  title: string;
  icon?: string;
  renderer?: React.ReactNode;
};

const toolbar: {
  items: TToolbarItem[];
} = {
  items: [
    { title: 'New', icon: 'plus' },
    { title: 'Edit', icon: 'pencil' },
    { title: 'Delete', icon: 'trash' },
    { title: 'Archive', icon: 'archive' },
    { title: 'Unarchive', icon: 'archive-fill' },
    { title: 'Refresh', icon: 'arrow-repeat' },
    {
      title: 'Advance Search',
      renderer: (
        <Box as="label" style={{ whiteSpace: 'nowrap' }}>
          Advance Search
        </Box>
      ),
    },
  ],
};

const ToolbarItem = withStyled(Button)<TToolbarItem>(
  ({ title, icon, renderer, ...rest }, ref) => (
    <Button
      {...rest}
      ref={ref}
      key={icon}
      variant="light"
      d="flex"
      alignItems="center"
      justifyContent="center"
      border
      title={title}
    >
      <span>{renderer ? renderer : icon ? <Icon use={icon} /> : title}</span>
    </Button>
  )
);

interface TOverflowToolbarItem extends TToolbarItem {
  onClick?: () => void;
}

function OverflowToolbarItem({ title, icon, onClick }: TOverflowToolbarItem) {
  return (
    <Box
      key={icon}
      d="flex"
      alignItems="center"
      style={{ minWidth: 100, cursor: 'pointer' }}
      title={title}
      onClick={onClick}
    >
      {icon && (
        <Box d="inline-block" me={2}>
          {' '}
          <Icon use={icon} />
        </Box>
      )}
      {title}
    </Box>
  );
}

function Toolbar() {
  return (
    <OverflowList
      items={toolbar.items}
      as={ButtonGroup}
      renderList={items =>
        items.map((item, index) => (
          <ToolbarItem key={index} {...(item as TToolbarItem)} />
        ))
      }
      renderOverflowItem={(props, index, closePopup) => (
        <OverflowToolbarItem
          key={index}
          {...(props as TOverflowToolbarItem)}
          onClick={closePopup}
        />
      )}
      renderButton={(type, props: any) => {
        if (type === 'dropdown') {
          return <ToolbarItem {...props} icon={'three-dots-vertical'} />;
        }
        return null;
      }}
    />
  );
}

export const Basic = () => {
  return (
    <Box style={{ marginLeft: 300 }}>
      <Toolbar />
    </Box>
  );
};

export const Multiple = () => {
  return (
    <Box d="flex">
      <Box flex={1} style={{ maxWidth: '50%' }}>
        <Toolbar />
      </Box>
      <Box flex={1} style={{ maxWidth: '50%' }}>
        <Toolbar />
      </Box>
    </Box>
  );
};
