import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import React, { useEffect, useRef } from "react"
import ContentEditable from 'react-contenteditable';

const TextArea = {
  minWidth: 210,
  minHeight: 30,
  outline: "none",
  backgroundColor: "#FFFFFF3A",
  padding: 10,
  whiteSpace: "nowrap"
}

const Placeholder = styled.div`
position: absolute;
top: 4px;
left: 4px;
color:gray;
padding:8px;
pointer-events: none;
`

export default observer(function Text({ model }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.el.current.setAttribute("contenteditable", "plaintext-only")
    }
  }, [])

  return <>
    <ContentEditable
      ref={ref}
      onPaste={(e) => {
        e.stopPropagation()
      }}
      html={model.data.text}
      onChange={(e) => {
        model.setText(e.target.value)
      }}
      tagName='div'
      style={TextArea}
      onKeyDown={(e) => {
        e.stopPropagation()
      }}
    />
    {model.data.text === "" &&
      <Placeholder>
        Text here...
      </Placeholder>}
  </>



})
