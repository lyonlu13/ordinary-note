import { observer } from 'mobx-react-lite';
import React from "react"
import { BlocksHolder } from 'define/blocks';

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
      style={{ display: "block" }}
      alt=""
      src={model.data.src}
      width={model.data.width}
      draggable="false"
    /></div>
})
