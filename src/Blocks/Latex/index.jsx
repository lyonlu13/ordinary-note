import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import React, { useRef } from "react"
import { BlockMath } from 'react-katex';
import { createPortal } from 'react-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { BlocksHolder } from 'define/blocks';

export default observer(function Latex({ model, isSelected, selectedBlock, draggingBlock }) {
  const ref = useRef(null)
  return <div
    style={{ minWidth: 120, minHeight: 40, padding: 10, color: model.data.code === "" ? "gray" : "black" }}
    onMouseDown={() => {
      if (isSelected) {
        draggingBlock(true)
        if (selectedBlock().length === 1)
          BlocksHolder.getInstance().sendToFront(model.id)
      }
    }}
  >
    <BlockMath
      ref={ref}
      math={model.data.code || "LaTeX..."}
    />
    {isSelected && selectedBlock().length === 1 && createPortal(
      <TextareaAutosize
        style={{
          outline: "none",
          padding: 5,
          resize: "none",
          width: "100%",
          borderRadius: 2,
          backgroundColor: "#f8f8f8",
          boxShadow: "0 0 2px 0.3px lightgray",
          border: "none"
        }}
        onMouseDown={(e) => { e.stopPropagation() }}
        onKeyDown={(e) => { e.stopPropagation() }}
        value={model.data.code}
        onChange={(e) => model.setCode(e.target.value)} />, document.getElementById("attributes"))}
  </div>
})
