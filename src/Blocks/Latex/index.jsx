import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import React, { useRef } from "react"
import { BlockMath } from 'react-katex';
import { createPortal } from 'react-dom';
import TextareaAutosize from 'react-textarea-autosize';

export default observer(function Latex({ model, isSelected }) {
  const ref = useRef(null)
  return <div style={{ minWidth: 120, minHeight: 40, padding: 10 }}>
    <BlockMath ref={ref} math={model.data.code} />
    {isSelected && createPortal(
      <TextareaAutosize
        style={{
          outline: "none",
          padding: 5,
          resize: "none",
          width: "100%",
          borderRadius: 2,
          backgroundColor: "#f8f8f8",
          boxShadow: "0 0 1px 0.3px gray",
          border: "none"
        }}
        value={model.data.code}
        onChange={(e) => model.setCode(e.target.value)} />, document.getElementById("attributes"))}
  </div>
})
