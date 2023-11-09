import { forwardRef, useCallback, useEffect, useState } from "react";

import { clsx } from "../clsx";
import { Collapse } from "../collapse";
import { CommandBar, CommandBarProps } from "../command-bar";
import { Scrollable } from "../scrollable";

import styles from "./panel.module.scss";

export interface PanelProps extends React.HTMLProps<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  toolbar?: CommandBarProps;
  scrollbar?: {
    custom?: boolean;
    trigger?: {
      headerShadow?: number;
      headerHide?: number;
    };
  };
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>((props, ref) => {
  const { className, children, scrollbar = {}, ...moreProps } = props;
  const {
    header,
    footer,
    toolbar,
    collapsible = false,
    collapsed = false,
    onToggle,
    ...restProps
  } = moreProps;

  const hasHeader = Boolean(header || toolbar || collapsible);
  const hasFooter = Boolean(footer);

  const [open, setOpen] = useState(!collapsed);
  const [collapseState, setCollapseState] = useState(
    collapsed ? "exited" : "entered",
  );

  const handleToggle = useCallback(() => setOpen((prev) => !prev), []);

  const onEnter = useCallback(() => setCollapseState("enter"), []);
  const onEntering = useCallback(() => setCollapseState("entering"), []);
  const onEntered = useCallback(() => {
    setCollapseState("entered");
    onToggle?.(false);
  }, [onToggle]);

  const onExit = useCallback(() => setCollapseState("exit"), []);
  const onExiting = useCallback(() => setCollapseState("exiting"), []);
  const onExited = useCallback(() => {
    setCollapseState("exited");
    onToggle?.(true);
  }, [onToggle]);

  const [headerShadow, setHeaderShadow] = useState(false);
  const [headerHide, setHeaderHide] = useState(false);

  const onScroll = useCallback<React.UIEventHandler<HTMLDivElement>>(
    (e) => {
      const st = e.currentTarget.scrollTop;
      const trigger = scrollbar.trigger ?? {};
      if (trigger.headerHide !== undefined) {
        setHeaderHide(st > trigger.headerHide);
      }
      if (trigger.headerShadow !== undefined) {
        setHeaderShadow(st > trigger.headerShadow);
      }
    },
    [scrollbar.trigger],
  );

  useEffect(() => {
    setOpen(!collapsed);
  }, [collapsed]);

  const collapseIcon = collapsible ? (
    <CommandBar
      items={[
        {
          key: "toggle",
          className: styles.toggle,
          iconProps: {
            icon: "keyboard_arrow_down",
          },
          onClick: handleToggle,
        },
      ]}
    />
  ) : null;

  const ContentPane = scrollbar?.custom ? Scrollable : "div";

  const content = (
    <div className={styles.body}>
      <ContentPane className={styles.content} onScroll={onScroll}>
        {children}
      </ContentPane>
      {hasFooter && <div className={styles.footer}>{footer}</div>}
    </div>
  );

  const body = collapsible ? (
    <Collapse
      in={open}
      onEnter={onEnter}
      onEntering={onEntering}
      onEntered={onEntered}
      onExit={onExit}
      onExiting={onExiting}
      onExited={onExited}
      className={styles.bodyWrapper}
    >
      {content}
    </Collapse>
  ) : (
    <div className={styles.bodyWrapper}>{content}</div>
  );

  return (
    <div
      ref={ref}
      className={clsx(styles.panel, className, styles[collapseState])}
      {...restProps}
    >
      {hasHeader && (
        <Header
          {...moreProps}
          handleToggle={handleToggle}
          className={clsx({
            [styles.hide]: headerHide,
            [styles.shadow]: headerShadow,
          })}
        >
          {collapseIcon}
        </Header>
      )}
      {body}
    </div>
  );
});

function Header(props: PanelProps & { handleToggle?: () => void }) {
  const { header, toolbar, className, children, collapsible, handleToggle } =
    props;
  return (
    <div className={clsx(styles.header, className)}>
      <div className={styles.headerInner}>
        {header && (
          <div
            {...(collapsible &&
              handleToggle && {
                onClick: handleToggle,
              })}
            className={clsx(styles.title, {
              [styles.collapse]: collapsible,
            })}
          >
            {header}
          </div>
        )}
        {toolbar && (
          <div className={styles.toolbar}>
            <CommandBar {...toolbar} />
          </div>
        )}
        {children && <div className={styles.toolbar}>{children}</div>}
      </div>
    </div>
  );
}
