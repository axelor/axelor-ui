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

export interface AccordionItemProps {
  flush?: boolean;
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

export interface AccordionProps {
  flush?: boolean;
}

export const Accordion = styled.div<AccordionProps>(({ flush }) => [
  'accordion',
  {
    'accordion-flush': flush,
  },
]);
