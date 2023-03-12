/**
 * @title Sortable
 */
import React from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { Tree } from "../tree";
import records from "./data";

const columns = [
  { name: "title", title: "Title", type: "String" },
  { name: "progress", title: "Progress" },
];

export default function Sortable() {
  const onLoad = React.useCallback(async (record: any) => {
    return new Promise((resolve) => {
      const project = records.find((p) => p.id === record.id);

      setTimeout(() => {
        resolve(project?.tasks || []);
      }, 100);
    });
  }, []);

  const onNodeMove = React.useCallback((record: any, newParent: any) => {
    return { ...record, category: newParent.name };
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Tree
        sortable
        columns={columns}
        records={records}
        onLoad={onLoad}
        onNodeMove={onNodeMove}
      />
    </DndProvider>
  );
}
