import { ReactNode } from "react";
import { DndProvider as ReactDNDProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export function DndProvider({ children }: { children: ReactNode }) {
  return <ReactDNDProvider backend={HTML5Backend}>{children}</ReactDNDProvider>;
}
