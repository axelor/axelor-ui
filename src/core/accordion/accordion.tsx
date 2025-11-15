import React, { forwardRef, useCallback, useId, useState } from "react";
import { Collapse } from "../collapse";
import styled, { withStyled } from "../styled";
import { useClassNames } from "../styles";
import { findAriaProp, findDataProp, makeTestId } from "../system/utils";

export interface AccordionHeaderProps {
  collapsed?: boolean;
}

const AccordionHeaderButton = styled.button<AccordionHeaderProps>(
  ({ collapsed }) => ["accordion-button", { collapsed }],
);

export const AccordionHeader = withStyled(AccordionHeaderButton)((
  props,
  ref,
) => {
  const classNames = useClassNames();
  const className = classNames("accordion-header");
  const testId = findDataProp(props, "data-testid");
  const ariaExpanded = findAriaProp(props, "aria-expanded");
  const ariaControls = findAriaProp(props, "aria-controls");
  const ariaLabel = findAriaProp(props, "aria-label");
  return (
    <h2 className={className} data-testid={testId}>
      <AccordionHeaderButton
        ref={ref}
        type="button"
        {...props}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        aria-label={ariaLabel}
        data-testid={makeTestId(testId, "toggle")}
      />
    </h2>
  );
});

export type EventKey = string | number;

export interface AccordionItemProps {
  flush?: boolean;
  eventKey: EventKey;
}

export const AccordionItem = styled.div<AccordionItemProps>(() => [
  "accordion-item",
]);

export interface AccordionBodyProps {}

const AccordionCollapse = styled(Collapse)<AccordionBodyProps>(() => [
  "accordion-collapse",
]);

export const AccordionBody = withStyled(AccordionCollapse)((
  { children, ...rest },
  ref,
) => {
  const classNames = useClassNames();
  const className = classNames("accordion-body");
  const testId = findDataProp(rest, "data-testid");
  const ariaLabelledBy = findAriaProp(rest, "aria-labelledby");
  return (
    <AccordionCollapse ref={ref} {...rest}>
      {(state) => {
        return (
          <div
            className={className}
            data-testid={testId}
            aria-labelledby={ariaLabelledBy}
            role="region"
          >
            {typeof children === "function" && children(state)}
            {typeof children !== "function" && children}
          </div>
        );
      }}
    </AccordionCollapse>
  );
});

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  flush?: boolean;
  alwaysOpen?: boolean;
  active?: EventKey[] | EventKey;
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      flush,
      children: childrenProp,
      active: activeProp,
      alwaysOpen,
      className,
      ...props
    },
    ref,
  ) => {
    const [active, setActive] = useState<EventKey[] | EventKey | undefined>(
      activeProp || (alwaysOpen ? [] : undefined),
    );
    const classNames = useClassNames();
    const classes = classNames([
      "accordion",
      {
        "accordion-flush": flush,
      },
      className,
    ]);
    const testId = findDataProp(props, "data-testid");
    const ariaLabel = findAriaProp(props, "aria-label");
    const accordionId = useId();

    const handleHeaderOnClick = useCallback(
      (
        event: React.MouseEvent<any>,
        eventKey: AccordionItemProps["eventKey"],
      ) => {
        setActive((active: any) => {
          if (alwaysOpen) {
            return active?.includes(eventKey)
              ? active.filter((key: any) => key !== eventKey)
              : [...active, eventKey];
          } else {
            return active === eventKey ? undefined : eventKey;
          }
        });
      },
      [alwaysOpen],
    );

    const children = React.Children.map(childrenProp, (child: any) => {
      if (child.type !== AccordionItem) {
        return child;
      }

      const { eventKey, children: itemChildren } = child.props;
      const itemTestId =
        findDataProp(child.props, "data-testid") ||
        makeTestId(testId, "item", eventKey);

      return React.cloneElement(child, {
        "data-testid": itemTestId,
        children: React.Children.map(itemChildren, (nestedchild) => {
          const { type } = nestedchild;

          const isActive = alwaysOpen
            ? (active as EventKey[]).includes(eventKey)
            : active === eventKey;

          if (type === AccordionHeader) {
            const { onClick } = nestedchild.props;
            const headerTestId =
              findDataProp(nestedchild.props, "data-testid") ||
              makeTestId(itemTestId, "header");
            const headerId = `${accordionId}-header-${eventKey}`;
            const bodyId = `${accordionId}-body-${eventKey}`;
            return React.cloneElement(nestedchild, {
              onClick: (event: React.MouseEvent<any>) => {
                handleHeaderOnClick(event, eventKey);
                onClick && onClick(event);
              },
              collapsed: !isActive,
              "data-testid": headerTestId,
              id: headerId,
              "aria-expanded": isActive,
              "aria-controls": bodyId,
            });
          } else if (type === AccordionBody) {
            const bodyTestId =
              findDataProp(nestedchild.props, "data-testid") ||
              makeTestId(itemTestId, "body");
            const headerId = `${accordionId}-header-${eventKey}`;
            const bodyId = `${accordionId}-body-${eventKey}`;
            return React.cloneElement(nestedchild, {
              in: isActive,
              id: bodyId,
              "data-testid": bodyTestId,
              "aria-labelledby": headerId,
            });
          } else {
            return nestedchild;
          }
        }),
      });
    });

    return (
      <div
        ref={ref}
        className={classes}
        {...props}
        data-testid={testId}
        aria-label={ariaLabel}
      >
        {children}
      </div>
    );
  },
);
