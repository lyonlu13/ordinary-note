import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import React, { useEffect, useRef } from "react"

const InputBase = styled.input`
  width:85px;
  font-size: 16px;
  border: none;
  border-radius: 2px;
  background-color: #f8f8f8;
  box-shadow: 0 0 1px 0.3px gray;
  outline:none;
`

export default observer(function Array({ model }) {
  const ref = useRef(null)

  return <div style={{ display: "flex", gap: 5, padding: 5 }}>
    {model.data.array.map((element, index) =>
      <Input value={element}
        onChange={(e) => {
          model.setElement(index, e.target.value)
        }} />
    )}
  </div>
})

function Input({ value, onChange }) {
  return <InputBase
    value={value}
    onKeyDown={(e) => {
      e.stopPropagation()
    }}
    onChange={onChange}
    style={{ textAlign: isNaN(value) || value === "" ? "left" : "center" }} />
}