import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import React from "react"
import ContentEditable from 'react-contenteditable';

const TextArea = {
  minWidth: 200,
  minHeight: 100,
  outline: "none",
  backgroundColor: "#ffffff7b",
  padding: 10,
}


export default observer(function Image({ model }) {

  return <div onDragOver={(e) => {
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
    /></div>
})
