export function ownerDocument(node: Node | null | undefined): Document {
  return (node && node.ownerDocument) || document;
}

export function isElementDisabled(element: HTMLElement): boolean {
  // @ts-ignore
  return element.disabled || element.getAttribute('aria-disabled') == true;
}

export function isElementHidden(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  return style.display === 'none' || style.visibility === 'hidden';
}
