import styled, { withStyled } from "../styled";
import { clsx, useClassNames } from "../styles";
import { TVariant } from "../system";

export interface AlertProps {
  variant?: TVariant;
  className?: string;
  children?: React.ReactNode;
}

export interface AlertHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export interface AlertLinkProps {
  className?: string;
  children?: React.ReactNode;
}

const HeaderRoot = styled.h4<AlertHeaderProps>();

export const AlertHeader = withStyled(HeaderRoot)((props, ref) => {
  const { className, children, ...rest } = props;
  const classNames = useClassNames();
  return (
    <HeaderRoot
      ref={ref}
      className={clsx(className, classNames("alert-heading"))}
      {...rest}
    >
      {children}
    </HeaderRoot>
  );
});

const StyledLink = styled.a<AlertLinkProps>();

export const AlertLink = withStyled(StyledLink)((props, ref) => {
  const { className, children, ...rest } = props;
  const classNames = useClassNames();
  return (
    <StyledLink
      ref={ref}
      className={clsx(className, classNames("alert-link"))}
      {...rest}
    >
      {children}
    </StyledLink>
  );
});

const AlertRoot = styled.div<AlertProps>();

export const Alert = withStyled(AlertRoot)((props, ref) => {
  const { className, children, variant = "info", ...rest } = props;
  const classNames = useClassNames();
  return (
    <AlertRoot
      ref={ref}
      className={clsx(className, classNames("alert", `alert-${variant}`))}
      {...rest}
    >
      {children}
    </AlertRoot>
  );
});
