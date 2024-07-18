import { BootstrapIcon, BootstrapIconName } from "../../icons/bootstrap-icon";
import { Box } from "../box";
import { clsx } from "../clsx";
import styled, { withStyled } from "../styled";
import { useClassNames } from "../styles";
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

const HeaderRoot = styled.strong<AlertHeaderProps>();

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

  const icons: Partial<Record<TVariant, BootstrapIconName>> = {
    success: "check-circle",
    info: "info-circle",
    warning: "exclamation-triangle",
    danger: "x-circle",
  };

  return (
    <Box
      ref={ref}
      className={className}
      d="flex"
      flexDirection="row"
      alignItems="baseline"
      p={3}
      rounded={2}
      borderStart={true}
      borderWidth={5}
      bgColor={`${variant}-subtle`}
      borderColor={`${variant}`}
      color={`${variant}-emphasis`}
      {...rest}
    >
      {icons[variant] && <BootstrapIcon icon={icons[variant]} />}
      <Box ms={2} alignSelf="center">
        {children}
      </Box>
    </Box>
  );
});
