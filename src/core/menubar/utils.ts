export const tryFocus = function (node: HTMLElement | null) {
  if (!node) {
    return;
  }

  if (node === document.activeElement) {
    return;
  }

  if (!node || !node.focus) {
    return;
  }

  node.focus();
};
