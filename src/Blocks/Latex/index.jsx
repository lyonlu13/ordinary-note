import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import React, { useRef } from "react"
import ContentEditable from 'react-contenteditable';
import { BlockMath } from 'react-katex';

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

export default observer(function Latex({ model }) {
  const ref = useRef(null)
  return <div style={{ minWidth: 120, minHeight: 60 }}>
    <BlockMath ref={ref} math={model.data.code} />
  </div>
})
