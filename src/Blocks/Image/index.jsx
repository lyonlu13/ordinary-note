import { observer } from 'mobx-react-lite';
import React from "react"
import { BlocksHolder } from 'define/blocks';
import { FaArrowsAltH } from "react-icons/fa"
import styled from 'styled-components';

const Float = styled.span`
  background-color:${(props) => props.bgcolor};
  width:30px;
  height:30px;
  display:inline-flex;
  justify-content:center;
  align-items:center;
  color: white;
  position:absolute;
  top:50%;
  right:0;
  transform: translate(50%,-50%);
  border-radius:2px;
  cursor:ew-resize	;
`

export default observer(function Image({ draggingBlock, isSelected, selectedBlock, resizingBlock, model }) {

  return <div
    onMouseDown={() => {
      if (isSelected) {
        draggingBlock(true)
        if (selectedBlock().length === 1)
          BlocksHolder.getInstance().sendToFront(model.id)
      }
    }}
    onDragOver={(e) => {
      e.stopPropagation();
      e.preventDefault();
    }}
    onDrop={(e) => {
      e.stopPropagation();
      e.preventDefault();
      const file = e.dataTransfer.files[0]
      if (file.type.indexOf("image") > -1) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          model.setSrc(reader.result)
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
      }
    }}>
    <img
      style={{ display: "block" }}
      alt=""
      src={model.data.src}
      width={model.data.width}
      draggable="false"
    />
    <Float
      bgcolor={model.info.color}
      style={displaying(isSelected && selectedBlock().length === 1)}
      onMouseDown={(e) => {
        e.stopPropagation()
        resizingBlock(true)
      }}>
      <FaArrowsAltH />
    </Float>
  </div>
})

const displaying = (show) => ({
  opacity: show ? 1 : 0,
  pointerEvents: show ? "auto" : "none",
  transition: "0.3s"
})
