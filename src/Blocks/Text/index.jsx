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


export default observer(function Text({ model }) {

  return <ContentEditable

    html={model.data.text}
    onChange={(e) => {
      model.setText(e.target.value)
      console.log(model);
    }}
    tagName='div'
    style={TextArea}
  />



})
