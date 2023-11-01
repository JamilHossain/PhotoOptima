// import { useState } from "react";
// import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import CustomPointDnd from "./CustomPointDnd";
import CustomPointsAdd from "./CustomPointsAdd";

function FileName() {
  return (
    <div>
      <p>sumon</p>
      <CustomPointsAdd title="Product Title" />
      <CustomPointDnd title="Product Title" />
    </div>
  );
}

export default FileName;
