import { forwardRef, useCallback, useEffect, useState } from "react";

import { clsx } from "../clsx";
import { CommandBar, CommandBarProps } from "../command-bar";

import { Collapse } from "../collapse";
import styles from "./panel.module.scss";

export interface PanelProps extends React.HTMLProps<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  toolbar?: CommandBarProps;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>((props, ref) => {
  const { className, children, ...moreProps } = props;
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
    collapsed ? "exited" : "entered"
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

  const content = (
    <div className={styles.body}>
      <div className={styles.content}>{children}</div>
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
      {hasHeader && <Header {...moreProps}>{collapseIcon}</Header>}
      {body}
    </div>
  );
});

function Header(props: PanelProps) {
  const { header, toolbar, children } = props;
  return (
    <div className={styles.header}>
      <div className={styles.title}>{header}</div>
      {toolbar && (
        <div className={styles.toolbar}>
          <CommandBar {...toolbar} />
        </div>
      )}
      {children && <div className={styles.toolbar}>{children}</div>}
    </div>
  );
}
