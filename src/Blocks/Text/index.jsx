import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import React from "react"
import ContentEditable from 'react-contenteditable';

const TextArea = {
  minWidth: 200,
  minHeight: 100,
  outline: "none",
  backgroundColor: "#FFFFFF3A",
  padding: 10,
}

const Placeholder = styled.div`
position: absolute;
top: 4px;
left: 4px;
color:gray;
padding:8px;
`


export default observer(function Text({ model }) {

  return <>
    <ContentEditable
      placeholder={"dwd"}
      html={model.data.text}
      onChange={(e) => {
        model.setText(e.target.value)
        console.log(model);
      }}
      tagName='div'
      style={TextArea}
    />
    {model.data.text == "" &&
      <Placeholder>
        Text...
      </Placeholder>}
  </>



})
