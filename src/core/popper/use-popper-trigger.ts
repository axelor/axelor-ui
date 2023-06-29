import { useCallback, useEffect, useRef, useState } from "react";

export type PoppupTriggerProps = {
  trigger: "click" | "hover" | "focus";
  interactive?: boolean;
  delay?: { open?: number; close?: number };
};

const defaultDelay = {
  click: { open: 0, close: 0 },
  focus: { open: 300, close: 100 },
  hover: { open: 300, close: 100 },
};

export function usePopperTrigger({
  trigger = "click",
  interactive,
  delay,
}: PoppupTriggerProps) {
  const [targetEl, setTargetEl] = useState<any>();
  const [contentEl, setContentEl] = useState<any>();
  const [open, setOpen] = useState(false);

  const hiding = useRef<boolean>();
  const inside = useRef<boolean>();
  const timer = useRef<number>();

  const { open: showDelay, close: hideDelay } = {
    ...defaultDelay[trigger],
    ...delay,
  };

  const showPopper = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), showDelay);
  }, [setOpen, showDelay]);

  const hidePopper = useCallback(() => {
    if (inside.current) return;
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setOpen(false);
    }, hideDelay);
  }, [setOpen, hideDelay]);

  const togglePopper = useCallback(() => {
    setOpen((state) => !state);
  }, [setOpen]);

  const onContentEnter = useCallback(() => {
    if (hiding.current) return;
    inside.current = true;
    showPopper();
  }, [showPopper]);

  const onContentLeave = useCallback(() => {
    hiding.current = true;
    inside.current = false;
    if (document.activeElement !== targetEl) {
      hidePopper();
    }
  }, [targetEl, hidePopper]);

  const showOnHover = useCallback(() => {
    hiding.current = false;
    showPopper();
  }, [showPopper]);

  // clear timeout
  useEffect(() => () => clearTimeout(timer.current), []);

  // handle click trigger
  useEffect(() => {
    if (targetEl && (trigger === "click" || interactive)) {
      targetEl.addEventListener("click", togglePopper);
      return () => {
        targetEl.addEventListener("click", togglePopper);
      };
    }
  }, [trigger, interactive, targetEl, togglePopper]);

  // handle hover trigger
  useEffect(() => {
    if (targetEl && trigger === "hover") {
      targetEl.addEventListener("mouseenter", showOnHover);
      targetEl.addEventListener("mouseleave", hidePopper);
      return () => {
        targetEl.removeEventListener("mouseenter", showOnHover);
        targetEl.removeEventListener("mouseleave", hidePopper);
      };
    }
  }, [trigger, targetEl, showPopper, hidePopper, showOnHover]);

  // handle focus trigger
  useEffect(() => {
    if (targetEl && trigger === "focus") {
      targetEl.addEventListener("focus", showPopper);
      targetEl.addEventListener("blur", hidePopper);
      return () => {
        targetEl.removeEventListener("focus", showPopper);
        targetEl.removeEventListener("blur", hidePopper);
      };
    }
  }, [trigger, targetEl, showPopper, hidePopper]);

  // handle interactive options
  useEffect(() => {
    if (interactive && contentEl && trigger !== "click") {
      contentEl.addEventListener("mouseenter", onContentEnter);
      contentEl.addEventListener("mouseleave", onContentLeave);
      return () => {
        contentEl.removeEventListener("mouseenter", onContentEnter);
        contentEl.removeEventListener("mouseleave", onContentLeave);
      };
    }
  }, [trigger, interactive, contentEl, onContentEnter, onContentLeave]);

  return {
    open,
    targetEl,
    contentEl,
    setTargetEl,
    setContentEl,
    onClickAway: hidePopper,
  };
}
