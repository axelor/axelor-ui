import {
  DragEventHandler,
  MouseEventHandler,
  PointerEventHandler,
  TouchEventHandler,
} from "react";
import styled from "../styled";

// ! Fix mouse event inferred as any type
// Since https://github.com/microsoft/TypeScript/pull/56004
// Mouse/touch/pointer event handlers copied from DOMAttributes
export interface BoxProps {
  // MouseEvents
  onAuxClick?: MouseEventHandler<HTMLElement>;
  onAuxClickCapture?: MouseEventHandler<HTMLElement>;
  onClick?: MouseEventHandler<HTMLElement>;
  onClickCapture?: MouseEventHandler<HTMLElement>;
  onContextMenu?: MouseEventHandler<HTMLElement>;
  onContextMenuCapture?: MouseEventHandler<HTMLElement>;
  onDoubleClick?: MouseEventHandler<HTMLElement>;
  onDoubleClickCapture?: MouseEventHandler<HTMLElement>;
  onDrag?: DragEventHandler<HTMLElement>;
  onDragCapture?: DragEventHandler<HTMLElement>;
  onDragEnd?: DragEventHandler<HTMLElement>;
  onDragEndCapture?: DragEventHandler<HTMLElement>;
  onDragEnter?: DragEventHandler<HTMLElement>;
  onDragEnterCapture?: DragEventHandler<HTMLElement>;
  onDragExit?: DragEventHandler<HTMLElement>;
  onDragExitCapture?: DragEventHandler<HTMLElement>;
  onDragLeave?: DragEventHandler<HTMLElement>;
  onDragLeaveCapture?: DragEventHandler<HTMLElement>;
  onDragOver?: DragEventHandler<HTMLElement>;
  onDragOverCapture?: DragEventHandler<HTMLElement>;
  onDragStart?: DragEventHandler<HTMLElement>;
  onDragStartCapture?: DragEventHandler<HTMLElement>;
  onDrop?: DragEventHandler<HTMLElement>;
  onDropCapture?: DragEventHandler<HTMLElement>;
  onMouseDown?: MouseEventHandler<HTMLElement>;
  onMouseDownCapture?: MouseEventHandler<HTMLElement>;
  onMouseEnter?: MouseEventHandler<HTMLElement>;
  onMouseLeave?: MouseEventHandler<HTMLElement>;
  onMouseMove?: MouseEventHandler<HTMLElement>;
  onMouseMoveCapture?: MouseEventHandler<HTMLElement>;
  onMouseOut?: MouseEventHandler<HTMLElement>;
  onMouseOutCapture?: MouseEventHandler<HTMLElement>;
  onMouseOver?: MouseEventHandler<HTMLElement>;
  onMouseOverCapture?: MouseEventHandler<HTMLElement>;
  onMouseUp?: MouseEventHandler<HTMLElement>;
  onMouseUpCapture?: MouseEventHandler<HTMLElement>;

  // Touch Events
  onTouchCancel?: TouchEventHandler<HTMLElement>;
  onTouchCancelCapture?: TouchEventHandler<HTMLElement>;
  onTouchEnd?: TouchEventHandler<HTMLElement>;
  onTouchEndCapture?: TouchEventHandler<HTMLElement>;
  onTouchMove?: TouchEventHandler<HTMLElement>;
  onTouchMoveCapture?: TouchEventHandler<HTMLElement>;
  onTouchStart?: TouchEventHandler<HTMLElement>;
  onTouchStartCapture?: TouchEventHandler<HTMLElement>;

  // Pointer Events
  onPointerDown?: PointerEventHandler<HTMLElement>;
  onPointerDownCapture?: PointerEventHandler<HTMLElement>;
  onPointerMove?: PointerEventHandler<HTMLElement>;
  onPointerMoveCapture?: PointerEventHandler<HTMLElement>;
  onPointerUp?: PointerEventHandler<HTMLElement>;
  onPointerUpCapture?: PointerEventHandler<HTMLElement>;
  onPointerCancel?: PointerEventHandler<HTMLElement>;
  onPointerCancelCapture?: PointerEventHandler<HTMLElement>;
  onPointerEnter?: PointerEventHandler<HTMLElement>;
  onPointerLeave?: PointerEventHandler<HTMLElement>;
  onPointerOver?: PointerEventHandler<HTMLElement>;
  onPointerOverCapture?: PointerEventHandler<HTMLElement>;
  onPointerOut?: PointerEventHandler<HTMLElement>;
  onPointerOutCapture?: PointerEventHandler<HTMLElement>;
  onGotPointerCapture?: PointerEventHandler<HTMLElement>;
  onGotPointerCaptureCapture?: PointerEventHandler<HTMLElement>;
  onLostPointerCapture?: PointerEventHandler<HTMLElement>;
  onLostPointerCaptureCapture?: PointerEventHandler<HTMLElement>;
}

export const Box = styled.div<BoxProps>();
