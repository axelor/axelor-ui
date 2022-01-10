import * as React from 'react';
import { Fade } from '../fade';
import { Box } from '../box';
import { Icon } from '../icon';
import { Menu, MenuProps } from '../menu/menu';
import { MenuItem } from '../menu/menu-item';
import cssStyles from './overflow-list.module.css';
import styled, { withStyled } from '../styled';
import { styleNames } from '../styles';

type OverflowState = {
  measure: boolean;
  offset: number;
  listOffset: number;
  compute: number;
};

type Mode = 'shrink' | 'grow';
type Action = Mode | 'measure' | 'compute';

const MODE: Record<string, Mode> = {
  SHRINK: 'shrink',
  GROW: 'grow',
};

const ACTIONS: Record<string, Action> = {
  ...MODE,
  MEASURE: 'measure',
  COMPUTE: 'compute',
};

const RESIZE_DELAY = 16;

export type TOverflowListItem = { title: string; icon?: string };

export interface OverflowDropdownProps<T> {
  className?: string;
  inverse?: boolean;
  vertical?: boolean;
  items: T[];
  children: React.ReactElement;
  dropdownMenuProps?: Partial<MenuProps>;
  renderOverflow?: (items: T[], closeDropdown?: () => void) => React.ReactNode;
  renderOverflowItem?: (
    item: T,
    index: number,
    closeDropdown?: () => void
  ) => React.ReactNode;
  renderButton?: (
    type: 'dropdown',
    props: React.HTMLAttributes<HTMLElement>
  ) => React.ReactNode;
  onOverflowChange?: (offset: number) => void;
}

const DropdownButton = withStyled(Box)((props, ref) => {
  return (
    <Box
      ref={ref}
      d="flex"
      justifyContent="center"
      alignItems="center"
      px={2}
      {...props}
    >
      <Icon use="three-dots" />
    </Box>
  );
});

function DropdownMenuItem({
  item,
  onClick,
}: {
  onClick: () => void;
  item: TOverflowListItem | React.ReactChild;
}) {
  return (
    <MenuItem as="button" className={cssStyles.defaultItem} onClick={onClick}>
      {React.isValidElement(item) ? item : (item as TOverflowListItem).title}
    </MenuItem>
  );
}

const DropdownList = styled.div<
  OverflowDropdownProps<TOverflowListItem | React.ReactChild>
>(({ vertical }) => [
  cssStyles.dropdownList,
  {
    [cssStyles.vertical]: vertical,
  },
]);

export const OverflowDropdown = withStyled(DropdownList)((props, ref) => {
  const {
    inverse = false,
    vertical,
    items,
    children,
    renderButton,
    renderOverflow,
    renderOverflowItem,
    dropdownMenuProps,
    onOverflowChange,
  } = props;
  const container = React.useRef<HTMLDivElement | null>(null);
  const listContainer = React.useRef<HTMLDivElement | null>(null);
  const dropdownRef = React.useRef<HTMLElement | null>(null);

  const mode = React.useRef<Mode>(MODE.SHRINK);
  const maxOffset = items.length;

  const [popover, setPopover] = React.useState<Record<'target', any> | null>(
    null
  );
  const [{ measure, compute, offset, listOffset }, dispatch] = React.useReducer(
    (state: OverflowState, action: Action) => {
      switch (action) {
        case ACTIONS.GROW:
        case ACTIONS.SHRINK:
          const offset = Math.min(
            maxOffset,
            state.offset + (action === ACTIONS.GROW ? 1 : -1)
          );
          return { ...state, offset };
        case ACTIONS.MEASURE:
          return { ...state, listOffset: state.offset, measure: false };
        case ACTIONS.COMPUTE:
          return { ...state, measure: true, compute: state.compute + 1 };
        default:
          return state;
      }
    },
    {
      measure: true,
      compute: 0,
      offset: maxOffset,
      listOffset: maxOffset,
    }
  );

  const computeOffset = React.useCallback(
    (offset: number) => {
      const _container = container.current;
      const _listContainer = listContainer.current;
      const prop = vertical ? 'offsetHeight' : 'offsetWidth';
      if (_container && _listContainer) {
        const size = _container[prop];
        const innerSize = _listContainer[prop];

        if (mode.current === ACTIONS.GROW) {
          if (size > innerSize) {
            if (offset === maxOffset) {
              dispatch(ACTIONS.MEASURE);
            } else {
              dispatch(ACTIONS.GROW);
            }
          } else {
            mode.current = MODE.SHRINK;
            dispatch(ACTIONS.SHRINK);
          }
        } else if (mode.current === MODE.SHRINK) {
          if (innerSize > size) {
            dispatch(ACTIONS.SHRINK);
          } else {
            dispatch(ACTIONS.MEASURE);
          }
        }
      }
    },
    [maxOffset, vertical]
  );

  function openDropdown(e: React.SyntheticEvent) {
    setPopover({
      target: dropdownRef.current || e.target,
    });
  }

  function closeDropdown() {
    setPopover(null);
  }
  React.useEffect(() => {
    computeOffset(offset);
  }, [offset, compute, computeOffset]);

  React.useEffect(() => {
    listOffset !== null && onOverflowChange && onOverflowChange(listOffset);
  }, [listOffset, onOverflowChange]);

  React.useImperativeHandle(ref, () => ({
    compute: () => dispatch(ACTIONS.COMPUTE),
  }));

  React.useEffect(() => {
    if (container.current) {
      let timer: NodeJS.Timeout;
      let init = false;
      let _size = 0;

      const clear = () => clearTimeout(timer);
      const resizer = (args: any) =>
        window.requestAnimationFrame(() => {
          if (!init) {
            return (init = true);
          }
          const [
            {
              contentRect: { width, height },
            },
          ] = args;
          clear();
          timer = setTimeout(() => {
            let size = vertical ? height : width;
            mode.current = size > _size ? MODE.GROW : MODE.SHRINK;
            _size = size;
            dispatch('compute');
          }, RESIZE_DELAY);
        });

      const resizeObserver = new ResizeObserver(resizer);
      resizeObserver.observe(container.current);

      return () => {
        clear();
        resizeObserver.disconnect();
      };
    }
  }, [container, vertical]);

  function renderPopover(offset: number) {
    function renderList() {
      const listItems = inverse
        ? (() => {
            let _list = items.slice(0, items.length - offset);
            return vertical ? _list : _list.reverse();
          })()
        : items.slice(offset);

      if (!renderOverflow && !renderOverflowItem) {
        return listItems.map((item, index) => (
          <DropdownMenuItem key={index} item={item} onClick={closeDropdown} />
        ));
      }

      return renderOverflow
        ? renderOverflow(listItems, closeDropdown)
        : renderOverflowItem
        ? listItems.map((item, index) => (
            <MenuItem as="button" key={index} onClick={closeDropdown}>
              {renderOverflowItem(item, index, closeDropdown)}
            </MenuItem>
          ))
        : null;
    }

    return (
      popover && (
        <Menu
          show
          arrow
          bg={'light'}
          color={'dark'}
          transition={Fade}
          container={document.body}
          placement={vertical ? 'end' : 'bottom'}
          navigation
          {...dropdownMenuProps}
          target={popover.target}
          onHide={closeDropdown}
        >
          {renderList() as any}
        </Menu>
      )
    );
  }

  function renderDropdownButton(offset: number) {
    if (offset >= items.length) return null;

    const props = {
      // ref: dropdownRef,
      onClick: (e: React.SyntheticEvent) =>
        popover ? closeDropdown() : openDropdown(e),
    };

    return renderButton ? (
      renderButton('dropdown', props)
    ) : (
      <DropdownButton {...props} />
    );
  }

  function renderList(offset: number, _props?: any) {
    return (
      <DropdownList {...props} {..._props}>
        {inverse && renderDropdownButton(offset)}
        {React.Children.toArray(children).slice(
          ...(inverse ? [items.length - offset] : [0, offset])
        )}
        {!inverse && renderDropdownButton(offset)}
      </DropdownList>
    );
  }

  return (
    <div
      ref={container}
      className={styleNames(cssStyles.dropdownListContainer, {
        [cssStyles.inverse]: inverse,
      })}
    >
      {measure &&
        renderList(offset, {
          ref: listContainer,
          className: cssStyles.temp,
        })}
      {renderList(listOffset)}
      {renderPopover(listOffset)}
    </div>
  );
});

export default OverflowDropdown;
