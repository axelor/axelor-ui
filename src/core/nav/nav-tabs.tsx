import React from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

import { Box } from "../box";
import { clsx } from "../clsx";
import { OverflowList, OverflowListButtonType } from "../overflow-list";
import { withStyled } from "../styled";
import { useClassNames, useTheme } from "../styles";
import { Nav } from "./nav";
import { NavItemProps, NavProps } from "./types";
import { getRGB } from "./utils";

import { MaterialIcon } from "../../icons/material-icon";
import classes from "./nav-tabs.module.scss";

const RESIZE_DELAY = 50;

function getStyle(style: any) {
  const { transform } = style;
  if (transform) {
    const [Y] = transform
      .slice("translate(".length, transform.length - 1)
      .split(",")
      .map((x: string) => x.trim());
    const axisLockX = `translate(${Y}, 0px)`;
    return {
      ...style,
      transform: axisLockX,
    };
  }
  return style;
}

export interface NavTabProps {
  item: NavItemProps;
  index: number;
  divider?: boolean;
  active?: boolean;
  onRender?: NavProps["onItemRender"];
  onClick?: (e: React.SyntheticEvent, tab: NavItemProps) => void;
  onClose?: (tab: NavItemProps, index?: number) => void;
  onContextMenu?: React.MouseEventHandler<HTMLElement>;
}

export interface NavTabsProps extends Pick<NavProps, "items" | "onItemRender"> {
  value?: NavItemProps["id"];
  draggable?: boolean;
  onReorder?: (dragIndex?: number, hoverIndex?: number) => void;
  onChange?: (id: NavItemProps["id"], tab: NavItemProps) => void;
  onClose?: NavTabProps["onClose"];
  onContextMenu?: React.MouseEventHandler<HTMLElement>;
}

const ScrollButton = withStyled(Box)((props, ref) => {
  return (
    <Box
      ref={ref}
      d="flex"
      justifyContent="center"
      alignItems="center"
      px={2}
      {...props}
    />
  );
});

const NavTabIcon = React.memo(function NavTabIcon({
  icon,
  color,
  bgColor,
}: {
  icon?: NavItemProps["icon"];
  color?: NavItemProps["iconColor"];
  bgColor: string;
}) {
  return (
    <Box
      d="flex"
      justifyContent="center"
      alignItems="center"
      className={classes.tabIcon}
      style={{ backgroundColor: bgColor }}
    >
      {icon ? icon({ color }) : null}
    </Box>
  );
});

const NavTab = withStyled(Box)(
  (
    {
      divider,
      active,
      index,
      item,
      onRender,
      onClose,
      onClick,
      ...rest
    }: NavTabProps,
    ref
  ) => {
    const color = item.iconColor || "blue";
    const bgColor = getRGB(color, 0.15);
    const classNames = useClassNames();

    const content = onRender ? onRender(item) : undefined;
    if (content === null) {
      return null;
    }

    return (
      <Box
        ref={ref}
        d="flex"
        alignItems="center"
        className={classNames(classes.tab, {
          [classes.active]: active,
        })}
        onClick={(e) => onClick && onClick(e, item)}
        {...rest}
      >
        {item.icon && (
          <NavTabIcon icon={item.icon} color={color} bgColor={bgColor} />
        )}
        {content ? (
          content
        ) : (
          <Box
            d="flex"
            flex={1}
            alignItems="center"
            className={classes.tabTitle}
          >
            <Box flex={1} mx={2}>{item.title}</Box>
            {onClose && (
              <Box
                className={classes.tabClose}
                onClick={(e) => onClose(item, index)}
              >
                <MaterialIcon icon="close" fontSize={20} />
              </Box>
            )}
          </Box>
        )}
        {active && <Box className={classes.tabBorder} />}
        {divider && <Box className={classes.tabDivider} />}
      </Box>
    );
  }
);

const DNDNavTab = (props: NavTabProps) => {
  const { item, index } = props;
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <NavTab
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={(ref) => provided.innerRef(ref)}
          style={getStyle(provided.draggableProps.style)}
          {...props}
        />
      )}
    </Draggable>
  );
};

const RenderNavTabs: React.FC<NavTabsProps> = (props) => {
  const {
    value,
    items,
    draggable,
    onItemRender,
    onChange,
    onClose,
    onContextMenu,
  } = props;
  const [overflowListRef, setOverflowListRef] =
    React.useState<HTMLElement | null>(null);
  const [scroll, setScroll] = React.useState(false);
  const isRTL = useTheme().dir === "rtl";

  const selectTab = React.useCallback(
    function selectTab(e: React.SyntheticEvent, tab: NavItemProps) {
      onChange && onChange(tab.id, tab);
    },
    [onChange]
  );

  const activeTabIndex = value
    ? items?.findIndex((item) => item.id === value)
    : -1;

  React.useEffect(() => {
    if (
      overflowListRef &&
      activeTabIndex !== undefined &&
      activeTabIndex >= 0
    ) {
      const target = overflowListRef.querySelector(
        `.${classes.tab}:nth-child(${activeTabIndex + 1})`
      ) as HTMLElement;
      const parent = target && target.parentElement;
      if (target && parent) {
        const total = target.offsetLeft + target.offsetWidth;
        const hasLeftScroll = target.offsetLeft < parent.scrollLeft;
        const hasRightScroll = total > parent.scrollLeft + parent.offsetWidth;

        if (hasLeftScroll || hasRightScroll) {
          const scrollX = hasLeftScroll
            ? target.offsetLeft
            : total - parent.offsetWidth;
          scrollX >= 0 && (parent.scrollLeft = scrollX);
        }
      }
    }
  }, [overflowListRef, activeTabIndex]);

  React.useEffect(() => {
    if (!overflowListRef) return;
    let timer: any;

    const clear = () => clearTimeout(timer);
    const resizer = () =>
      window.requestAnimationFrame(() => {
        clear();
        timer = setTimeout(() => {
          const [scrollLeft, tabs, scrollRight] = overflowListRef.children;
          const tabsWidth = Array.from(tabs.children).reduce(
            (total, tab) =>
              total + (tab ? (tab as HTMLElement).offsetWidth : 0) || 0,
            0
          );
          if (tabsWidth > 0) {
            const show =
              tabsWidth +
                (((scrollLeft as HTMLElement).offsetWidth || 0) +
                  ((scrollRight as HTMLElement).offsetWidth || 0)) >=
              overflowListRef.offsetWidth;
  
            setScroll(show);
          }
        }, RESIZE_DELAY);
      });

    const resizeObserver = new ResizeObserver(resizer);
    resizeObserver.observe(overflowListRef);

    return () => {
      clear();
      resizeObserver.disconnect();
    };
  }, [overflowListRef, items?.length]);

  const classNames = useClassNames();
  const TabComponent = draggable ? DNDNavTab : NavTab;
  return (
    <Box
      className={classNames("nav-custom-tabs", classes.root, {
        [classes.rtl]: isRTL,
      })}
    >
      <Nav
        {...props}
        onRender={(props) => (
          <OverflowList
            ref={setOverflowListRef}
            d="flex"
            className={clsx(classes.tabList, {
              [classes.hasScroll]: scroll,
            })}
            scrollable
            items={props.items as any}
            renderListItem={(item, index) => (
              <TabComponent
                key={item.id}
                item={item as NavItemProps}
                index={index}
                active={value === item.id}
                divider={
                  !(index === activeTabIndex || index - 1 === activeTabIndex)
                }
                onClick={selectTab}
                onClose={onClose}
                onRender={onItemRender}
                onContextMenu={onContextMenu}
              />
            )}
            renderButton={(type: OverflowListButtonType, props: any) => {
              const buttonProps = {
                className: classNames(props.className, {
                  [classes.hide]: !scroll,
                }),
              };
              if (type === "scroll-left") {
                return (
                  <ScrollButton {...props} {...buttonProps}>
                    <MaterialIcon
                      icon={isRTL ? "navigate_next" : "navigate_before"}
                    />
                  </ScrollButton>
                );
              }
              if (type === "scroll-right") {
                return (
                  <ScrollButton {...props} {...buttonProps}>
                    <MaterialIcon
                      icon={isRTL ? "navigate_before" : "navigate_next"}
                    />
                  </ScrollButton>
                );
              }
              return null;
            }}
          />
        )}
      />
      {!props.draggable && <Box className={classes["tabs-divider"]} />}
    </Box>
  );
};

const DNDNavTabs: React.FC<NavTabsProps> = function (props) {
  const { items, onReorder } = props;
  const hasItems = (items || []).length > 1;
  const handleDragEnd = React.useCallback(
    (result: DropResult) => {
      const { source, destination } = result;
      // dropped outside the list
      if (!destination) {
        return;
      }
      if (destination.index === source.index) {
        return;
      }
      // skip if only one tab in list
      if (!hasItems) return;

      const dragIndex = source.index;
      const hoverIndex = destination.index;
      onReorder && onReorder(dragIndex, hoverIndex);
    },
    [hasItems, onReorder]
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={"NAVTABS"} type={"TAB"} direction="horizontal">
        {(provided, snapshot) => (
          <div {...provided.droppableProps}>
            <Box
              className={classes.dndWrapper}
              d="flex"
              ref={provided.innerRef}
            >
              <RenderNavTabs {...props} />
              {provided.placeholder}
            </Box>
            <Box className={classes["tabs-divider"]} />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export const NavTabs: React.FC<NavTabsProps> = (props) => {
  const Component = props.draggable ? DNDNavTabs : RenderNavTabs;
  return <Component {...props} />;
};
