/**
 * @title Basic
 */
import React from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { ReactComponent as BiRemoveIcon } from "bootstrap-icons/icons/x.svg";
import { Tree } from "../tree";
import records from "./data";

const columns = [
  { name: "title", title: "Title", type: "String" },
  { name: "progress", title: "Progress" },
  { name: "removeBtn", title: "", width: 50 },
];

function TextRenderer(props: any) {
  const {
    data: { data },
    column,
  } = props;
  if (column.name === "removeBtn") {
    return (
      <span>
        <BiRemoveIcon />
      </span>
    );
  }
  return (data && data[column.name]) || "--";
}

export default function Basic() {
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
        columns={columns}
        records={records}
        onLoad={onLoad}
        onNodeMove={onNodeMove}
        textRenderer={TextRenderer}
      />
    </DndProvider>
  );
}
