import React, { forwardRef, useCallback, useState } from 'react';
import { Collapse } from '../collapse';
import styled, { withStyled } from '../styled';
import { useStyleNames } from '../system';

export interface AccordionHeaderProps {
  collapsed?: boolean;
}

const AccordionHeaderButton = styled.button<AccordionHeaderProps>(
  ({ collapsed }) => ['accordion-button', { collapsed }]
);

export const AccordionHeader = withStyled(AccordionHeaderButton)(
  (props, ref) => {
    const className = useStyleNames(() => ['accordion-header'], []);
    return (
      <h2 className={className}>
        <AccordionHeaderButton ref={ref} type="button" {...props} />
      </h2>
    );
  }
);

type EventKey = string | number;

export interface AccordionItemProps {
  flush?: boolean;
  eventKey: EventKey;
}

export const AccordionItem = styled.div<AccordionItemProps>(() => [
  'accordion-item',
]);

export interface AccordionBodyProps {}

const AccordionCollapse = styled(Collapse)<AccordionBodyProps>(() => [
  'accordion-collapse',
]);

export const AccordionBody = withStyled(AccordionCollapse)(
  ({ children, ...rest }, ref) => {
    const className = useStyleNames(() => ['accordion-body'], []);
    return (
      <AccordionCollapse ref={ref} {...rest}>
        <div className={className}>{children}</div>
      </AccordionCollapse>
    );
  }
);

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
    ref
  ) => {
    const [active, setActive] = useState<EventKey[] | EventKey | undefined>(
      activeProp || (alwaysOpen ? [] : undefined)
    );

    const classes = useStyleNames(
      () => [
        'accordion',
        {
          'accordion-flush': flush,
        },
        className,
      ],
      [flush, className]
    );

    const handleHeaderOnClick = useCallback(
      (
        event: React.MouseEvent<any>,
        eventKey: AccordionItemProps['eventKey']
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
      [alwaysOpen]
    );

    const children = React.Children.map(childrenProp, (child: any) => {
      if (child.type !== AccordionItem) {
        return child;
      }

      const { eventKey, children: itemChildren } = child.props;

      return React.cloneElement(child, {
        children: React.Children.map(itemChildren, nestedchild => {
          const { type } = nestedchild;

          const isActive = alwaysOpen
            ? (active as EventKey[]).includes(eventKey)
            : active === eventKey;

          if (type === AccordionHeader) {
            const { onClick } = nestedchild.props;
            return React.cloneElement(nestedchild, {
              onClick: (event: React.MouseEvent<any>) => {
                handleHeaderOnClick(event, eventKey);
                onClick && onClick(event);
              },
              collapsed: !isActive,
            });
          } else if (type === AccordionBody) {
            return React.cloneElement(nestedchild, {
              in: isActive,
            });
          } else {
            return nestedchild;
          }
        }),
      });
    });

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);
