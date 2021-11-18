import * as React from 'react';
import { Popper } from '../popper';
import { Fade } from '../fade';
import { Box } from '../box';
import { Icon } from '../icon';
import { ClickAwayListener } from '../click-away-listener';
import { styleNames } from '../styles';
import cssStyles from './overflow-list.module.css';

export type TOverflowListItem = { title: string; icon?: string };

export type OverflowDropdownProps<T> = {
  className?: string;
  inverse?: boolean;
  vertical?: boolean;
  items: T[];
  children: React.ReactElement;
  renderOverflow?: (items: T[], closeDropdown?: () => void) => React.ReactNode;
  renderOverflowItem?: (item: T, closeDropdown?: () => void) => React.ReactNode;
  renderButton?: (
    type: 'dropdown',
    props: React.HTMLAttributes<HTMLElement>
  ) => React.ReactNode;
};

function getDropdown(content: HTMLElement): HTMLElement | null {
  return content.querySelector(`.${cssStyles.dropdownIcon}`);
}

function getContentOffset(
  content: HTMLElement,
  attr: 'clientHeight' | 'clientWidth',
  inverse: boolean
): number {
  const dropdown = getDropdown(content);
  const dropdownWidth = dropdown ? dropdown.offsetWidth : 0;
  const size = content[attr] - dropdownWidth;
  const children = Array.from(content.children).filter(
    item => item !== dropdown
  );

  let total = 0;

  const isContentOverflow = (i: number, isLast: boolean): boolean => {
    const element: any = children[i];
    total =
      total +
      element[attr.replace('client', 'offset')] -
      (isLast ? dropdownWidth : 0);
    return total > size;
  };

  if (inverse) {
    for (let i = children.length - 1; i >= 0; i--) {
      if (isContentOverflow(i, i === 0)) {
        return i;
      }
    }
  } else {
    for (let i = 0; i < children.length; i++) {
      if (isContentOverflow(i, i === children.length - 1)) {
        return i;
      }
    }
  }
  return inverse ? -1 : children.length;
}

function DropdownButton(props: React.HTMLAttributes<HTMLElement>) {
  return (
    <Box d="flex" justifyContent="center" alignItems="center" px={2}>
      <Icon use="three-dots" {...props} />
    </Box>
  );
}

function DropdownMenuItem({
  item,
  onClick,
}: {
  onClick: () => void;
  item: TOverflowListItem | React.ReactChild;
}) {
  return (
    <Box
      p={2}
      d="flex"
      justifyContent="center"
      border
      className={cssStyles.defaultItem}
      onClick={onClick}
    >
      {React.isValidElement(item) ? item : (item as TOverflowListItem).title}
    </Box>
  );
}

export default function OverflowDropdown({
  inverse = false,
  className,
  vertical,
  items,
  children,
  renderButton,
  renderOverflow,
  renderOverflowItem,
}: OverflowDropdownProps<TOverflowListItem | React.ReactChild>) {
  const [content, setContent] = React.useState<HTMLElement | null>(null);
  const [offset, setOffset] = React.useState<number | null>(null);
  const [popover, setPopover] = React.useState<Record<'target', any> | null>(
    null
  );

  const clientProp = vertical ? 'clientHeight' : 'clientWidth';

  function openDropdown(e: React.SyntheticEvent) {
    setPopover({
      target: e.target,
    });
  }

  function closeDropdown() {
    setPopover(null);
  }

  const hasDropdown =
    (offset || 0) >= 0 &&
    (offset || 0) < React.Children.toArray(children).length;

  const computeOffset = React.useCallback(() => {
    if (content) {
      const offset = getContentOffset(content, clientProp, inverse);
      setOffset(offset);
      setPopover(null);
    }
    if (content && inverse) {
      const getLeft = (element: HTMLElement | null) =>
        (element?.getBoundingClientRect() || {}).left || 0;

      const dropdown = getDropdown(content);
      const containerLeft = getLeft(content.parentElement);
      const dropdownLeft =
        getLeft(dropdown) + Math.abs(parseInt(content.style.left));

      content.style.left =
        dropdownLeft > containerLeft
          ? `-${dropdownLeft - containerLeft}px`
          : '0px';
    }
  }, [content, inverse, clientProp]);

  function renderDropdownButton() {
    const props = {
      className: cssStyles.dropdownIcon,
      onClick: (e: React.SyntheticEvent) =>
        popover ? closeDropdown() : openDropdown(e),
    };

    return (
      hasDropdown &&
      (renderButton ? (
        renderButton('dropdown', props)
      ) : (
        <DropdownButton {...props} />
      ))
    );
  }

  function renderPopover() {
    function renderList() {
      const listItems =
        offset !== null
          ? inverse
            ? items.slice(0, offset + 1).reverse()
            : items.slice(offset)
          : [];

      if (!renderOverflow && !renderOverflowItem) {
        return (
          <Box d="flex" flexDirection="column">
            {listItems.map((item, index) => (
              <DropdownMenuItem
                key={index}
                item={item}
                onClick={closeDropdown}
              />
            ))}
          </Box>
        );
      }

      return renderOverflow ? (
        renderOverflow(listItems, closeDropdown)
      ) : renderOverflowItem ? (
        <Box>
          {listItems.map(item => renderOverflowItem(item, closeDropdown))}
        </Box>
      ) : null;
    }

    return (
      popover && (
        <Popper
          open
          arrow
          bg={'white'}
          color={'dark'}
          transition={Fade}
          container={document.body}
          target={popover.target}
          placement={'bottom'}
        >
          <ClickAwayListener onClickAway={closeDropdown}>
            <Box>{renderList()}</Box>
          </ClickAwayListener>
        </Popper>
      )
    );
  }

  function renderChildren() {
    return (
      <div
        ref={setContent}
        className={styleNames(className, cssStyles.content, {
          [cssStyles.inverse]: inverse,
        })}
      >
        {offset !== null ? (
          React.Children.map(children, (element: React.ReactChild, i) => {
            const isOverflowStart = i === offset;
            const isOverflow = inverse ? i <= offset : i >= offset;
            return (
              <React.Fragment>
                {isOverflowStart && !inverse && renderDropdownButton()}
                {isOverflow ? (
                  <div className={cssStyles.hidden}>{element}</div>
                ) : (
                  element
                )}
                {isOverflowStart && inverse && renderDropdownButton()}
              </React.Fragment>
            );
          })
        ) : (
          <>
            {children}
            {renderDropdownButton()}
          </>
        )}
      </div>
    );
  }

  React.useEffect(() => {
    if (content) {
      const resizeObserver = new ResizeObserver(computeOffset);
      resizeObserver.observe(content);
      computeOffset();
      return () => resizeObserver.disconnect();
    }
  }, [content, computeOffset]);

  return (
    <>
      {renderChildren()}
      {renderPopover()}
    </>
  );
}
