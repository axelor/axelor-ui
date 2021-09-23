import React from 'react';
import { Popper } from '../popper';
import { Fade } from '../fade';
import { Box } from '../box';
import { Icon } from '../icon';
import { ClickAwayListener } from '../click-away-listener';
import { styleNames } from '../styles';
import cssStyles from './overflow-list.module.css';

function getDropdown(content: HTMLElement): HTMLElement | null {
  return content.querySelector(`.${cssStyles.dropdownIcon}`);
}

function getContentOffset(
  content: any,
  prop: string,
  inverse: boolean
): number {
  const dropdown = getDropdown(content);
  const dropdownWidth = dropdown ? dropdown.offsetWidth : 0;
  const size = content[prop] - dropdownWidth;
  const children = Array.from(content.children).filter(
    item => item !== dropdown
  );

  let total = 0;

  const isContentOverflow = (i: number, isLast: boolean): boolean => {
    const element: any = children[i];
    total =
      total +
      element[prop.replace('client', 'offset')] -
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

export type OverflowDropdownProps = {
  className?: string;
  inverse?: boolean;
  vertical?: boolean;
  children: (props: any) => React.ReactNode;
  dropdown?: (props: any) => React.ReactNode;
  dropdownButton?: (props: any) => React.ReactNode;
};

export default function OverflowDropdown({
  inverse = false,
  className,
  vertical,
  children,
  dropdown,
  dropdownButton,
}: OverflowDropdownProps) {
  const [content, setContent] = React.useState<HTMLElement | null>(null);
  const [offset, setOffset] = React.useState<number | null>(null);
  const [popover, setPopover] = React.useState<Record<'target', any> | null>(
    null
  );
  const clientProp = vertical ? 'clientHeight' : 'clientWidth';

  function openDropdown(e: MouseEvent) {
    setPopover({
      target: e.target,
    });
  }

  function closeDropdown() {
    setPopover(null);
  }

  const childrenList: any =
    children({
      closeOverflowPopup: closeDropdown,
    }) || [];

  const hasDropdown = (offset || 0) >= 0 && (offset || 0) < childrenList.length;

  const computeOffset = React.useCallback(() => {
    const offset = getContentOffset(content, clientProp, inverse);
    content && setOffset(offset);
    content && setPopover(null);
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
    return (
      hasDropdown &&
      dropdownButton &&
      dropdownButton({
        className: cssStyles.dropdownIcon,
        onClick: popover ? closeDropdown : openDropdown,
      })
    );
  }

  function renderPopover() {
    const getList = () => React.Children.toArray(childrenList);
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
            <Box>
              {dropdown &&
                dropdown({
                  children:
                    offset !== null
                      ? inverse
                        ? getList()
                            .slice(0, offset + 1)
                            .reverse()
                        : getList().slice(offset)
                      : childrenList,
                })}
            </Box>
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
          React.Children.map(childrenList, (element: any, i) => {
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
            {childrenList}
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

OverflowDropdown.defaultProps = {
  dropdown: ({ children }: any) => children,
  dropdownButton: (props: any) => <Icon use="three-dots" {...props} />,
};
