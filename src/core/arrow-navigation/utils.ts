export function ownerDocument(node: Node | null | undefined): Document {
  return (node && node.ownerDocument) || document;
}

export function isElementDisabled(element: HTMLElement): boolean {
  return (
    // @ts-expect-error disabled
    element.disabled || `${element.getAttribute("aria-disabled")}` === "true"
  );
}

export function isElementHidden(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  return style.display === "none" || style.visibility === "hidden";
}

function hasFocus(element: Node) {
  return element === document.activeElement;
}

export function getPrevElement(list: HTMLElement | null, item: HTMLElement) {
  if (item && item?.previousElementSibling) {
    return item?.previousElementSibling;
  }
  return list?.lastChild;
}

export function getNextElement(list: HTMLElement | null, item: HTMLElement) {
  if (item && item?.nextElementSibling) {
    return item?.nextElementSibling;
  }
  return list?.firstChild;
}

export function navigate(
  elements: HTMLElement[][],
  key: string,
  rtl?: boolean,
) {
  if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
    return null;
  }

  let row: number = -1;
  let col: number = -1;

  for (let i = 0; i < elements.length; i++) {
    const rowElement: any = elements[i];
    if (rowElement.length) {
      for (let j = 0; j < rowElement.length; j++) {
        const element = rowElement[j];
        if (hasFocus(element)) {
          row = i;
          col = j;
          break;
        }
      }
    } else if (hasFocus(rowElement)) {
      row = i;
    }
  }

  const nextRow = () => (row = row === elements.length - 1 ? 0 : row + 1);
  const prevRow = () => (row = row === 0 ? elements.length - 1 : row - 1);
  const moveNext = () => col++;
  const movePrev = () => col--;
  const moveStart = () => (col = 0);
  const moveEnd = () => (col = elements[row].length - 1);
  const isStart = () => col === 0;
  const isEnd = () => col === elements[row].length - 1;
  const hasCol = () => col >= 0;

  const leftKey = rtl ? "ArrowRight" : "ArrowLeft";
  const rightKey = rtl ? "ArrowLeft" : "ArrowRight";

  function perform(key: string): HTMLElement {
    switch (key) {
      case "ArrowUp":
        prevRow();
        break;
      case "ArrowDown":
        nextRow();
        break;
      case leftKey:
        if (hasCol()) {
          isStart() ? moveEnd() : movePrev();
        } else {
          prevRow();
        }
        break;
      case rightKey:
        if (hasCol()) {
          isEnd() ? moveStart() : moveNext();
        } else {
          nextRow();
        }
        break;
    }

    const cell = (hasCol() ? elements[row][col] : elements[row]) as HTMLElement;

    if (!cell || isElementDisabled(cell) || isElementHidden(cell)) {
      return perform(key);
    }

    return cell;
  }

  return perform(key);
}
