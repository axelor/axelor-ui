import { useCallback, useState } from "react";
import { Box } from "../box";
import { clsx } from "../clsx";
import { Fade, FadeProps } from "../fade";
import { FocusTarget, FocusTrap } from "../focus-trap";
import { Portal } from "../portal";
import styled, { withStyled } from "../styled";
import { useClassNames } from "../styles";
import styles from "./dialog.module.scss";

export interface DialogProps {
  open: boolean;
  className?: string;
  children?: React.ReactNode;
  backdrop?: boolean;
  scrollable?: boolean;
  fullscreen?: boolean;
  centered?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  initialFocus?: FocusTarget;
  timeout?: FadeProps["timeout"];
  onShow?: () => void;
  onHide?: () => void;
}

export interface DialogTitleProps {
  className?: string;
  children?: React.ReactNode;
}

export interface DialogHeaderProps {
  className?: string;
  children?: React.ReactNode;
  onCloseClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export interface DialogFooterProps {
  className?: string;
  children?: React.ReactNode;
}

export interface DialogContentProps {
  className?: string;
  children?: React.ReactNode;
}

const TitleRoot = styled.h1<DialogTitleProps>();

export const DialogTitle = withStyled(TitleRoot)((props, ref) => {
  const { className, children, ...rest } = props;
  const classNames = useClassNames();
  return (
    <TitleRoot
      fontSize={5}
      className={clsx(className, classNames("modal-title"))}
      ref={ref}
      {...rest}
    >
      {children}
    </TitleRoot>
  );
});

const HeaderRoot = styled.div<DialogHeaderProps>();

export const DialogHeader = withStyled(HeaderRoot)((props, ref) => {
  const { className, children, onCloseClick, ...rest } = props;
  const classNames = useClassNames();
  return (
    <HeaderRoot
      ref={ref}
      className={clsx(className, classNames("modal-header"))}
      {...rest}
    >
      <Box d="flex" flex={1} alignItems="center" g={2}>
        {children}
      </Box>
      {onCloseClick && (
        <Box
          as="button"
          tabIndex={0}
          className={classNames("btn-close")}
          onClick={onCloseClick}
        />
      )}
    </HeaderRoot>
  );
});

const FooterRoot = styled.div<DialogFooterProps>();

export const DialogFooter = withStyled(FooterRoot)((props, ref) => {
  const { className, children, ...rest } = props;
  const classNames = useClassNames();
  return (
    <Box
      ref={ref}
      className={clsx(className, classNames("modal-footer"))}
      {...rest}
    >
      {children}
    </Box>
  );
});

const ContentRoot = styled.div<DialogContentProps>();

export const DialogContent = withStyled(ContentRoot)((props, ref) => {
  const { className, children, ...rest } = props;
  const classNames = useClassNames();
  return (
    <ContentRoot
      ref={ref}
      className={clsx(className, classNames("modal-body"))}
      {...rest}
    >
      {children}
    </ContentRoot>
  );
});

export const Dialog = withStyled(Box)<DialogProps>((props, ref) => {
  const {
    open,
    size,
    backdrop,
    centered,
    scrollable,
    fullscreen,
    onShow,
    onHide,
    className,
    children,
    initialFocus = false,
    ...rest
  } = props;
  const classNames = useClassNames();
  const [entered, setEntered] = useState(false);

  const onEntering = useCallback(() => {
    setEntered(true);
  }, []);

  const onExiting = useCallback(() => {
    setEntered(false);
  }, []);

  const onEntered = useCallback(() => {
    if (onShow) onShow();
  }, [onShow]);

  const onExited = useCallback(() => {
    if (onHide) onHide();
  }, [onHide]);

  return (
    <Portal>
      {backdrop && (
        <Fade in={open} mountOnEnter unmountOnExit>
          <Box
            className={classNames("modal-backdrop", "show", "fade")}
            tabIndex={-1}
          />
        </Fade>
      )}
      <Fade
        in={open}
        onEntering={onEntering}
        onEntered={onEntered}
        onExited={onExited}
        onExiting={onExiting}
        mountOnEnter
        unmountOnExit
      >
        <Box
          tabIndex={-1}
          className={clsx(className, styles.dialogRoot, classNames("modal"))}
          {...rest}
        >
          <Box
            tabIndex={-1}
            className={clsx(
              styles.dialog,
              { [styles.show]: entered },
              classNames("modal-dialog", {
                "modal-dialog-centered": centered,
                "modal-dialog-scrollable": scrollable,
                "modal-fullscreen": fullscreen,
                "modal-sm": size === "sm",
                "modal-lg": size === "lg",
                "modal-xl": size === "xl",
              })
            )}
            ref={ref}
          >
            <FocusTrap enabled={open} initialFocus={initialFocus}>
              <Box className={classNames("modal-content")} tabIndex={-1}>
                {children}
              </Box>
            </FocusTrap>
          </Box>
        </Box>
      </Fade>
    </Portal>
  );
});
