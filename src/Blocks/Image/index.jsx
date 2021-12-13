import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import React from "react"
import ContentEditable from 'react-contenteditable';
import { BlocksHolder } from 'define/blocks';

const TextArea = {
  minWidth: 200,
  minHeight: 100,
  outline: "none",
  backgroundColor: "#ffffff7b",
  padding: 10,
}


export default observer(function Image({ draggingBlock, isSelected, selectedBlock, model }) {

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
      alt=""
      src={model.data.src}
      width={model.data.width}
      draggable="false"
    /></div>
})
