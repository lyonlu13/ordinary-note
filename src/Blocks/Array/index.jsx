import { observer } from "mobx-react-lite"
import styled from "styled-components"
import React, { useEffect, useRef } from "react"
import { FaPlus, FaTimes, FaGripLines } from "react-icons/fa"
import { Position } from "./../../define/basic"

const InputBase = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  font-size: 16px;
  border-radius: 2px;
  background-color: #f8f8f8;
  box-shadow: 0 0 1px 0.3px gray;
  margin: 5px 2.5px;
  & input {
    outline: none;
    width: 85px;
    border: none;
    background-color: transparent;
  }
`

const AddBtn = styled.span`
  background-color: ${(props) => props.bgcolor};
  display: flex;
  align-items: center;
  font-size: 12px;
  padding: 2px;
  border-radius: 2px;
  color: white;
  &:hover {
    background-color: white;
    color: ${(props) => props.bgcolor};
  }
`

const RemoveBtn = styled.span`
  position: absolute;
  right: 0;
  border-radius: 100px;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  padding: 3px;
  color: ${(props) => props.bgcolor};
  &:hover {
    background-color: ${(props) => props.bgcolor};
    color: white;
  }
`

export default observer(function Array({ model, isSelected }) {
  const ref = useRef(null)

  return (
    <div style={{ display: "flex", gap: 5, padding: 2 }}>
      {model.data.array.map((element, index) => (
        <Input
          value={element}
          onChange={(e) => {
            model.setElement(index, e.target.value)
          }}
          isSelected={isSelected}
          model={model}
          deleteItem={() => {
            const clone = [...model.data.array]
            clone.splice(index, 1)
            model.setArray(clone)
          }}
        />
      ))}
      <AddBtn
        bgcolor={model.info.color}
        style={{
          ...displaying(isSelected, true),
        }}
        onClick={() => {
          model.setArray([...model.data.array, ""])
        }}
      >
        <FaPlus />
      </AddBtn>
    </div>
  )
})

function Input({ value, onChange, isSelected, model, deleteItem }) {
  return (
    <span>
      <InputBase>
        <input
          type="text"
          value={value}
          onKeyDown={(e) => {
            e.stopPropagation()
          }}
          onChange={onChange}
          style={{ textAlign: isNaN(value) || value === "" ? "left" : "center" }}
        />
        <RemoveBtn
          bgcolor={model.info.color}
          style={{
            flexGrow: 1,
            ...displaying(isSelected),
          }}
          onClick={() => {
            deleteItem()
          }}
        >
          <FaTimes />
        </RemoveBtn>
      </InputBase>
      <div
        style={{
          flexGrow: 1,
          textAlign: "center",
          fontSize: 12,
          ...displaying(isSelected),
        }}
      >
        <FaGripLines color={model.info.color} />
      </div>
    </span>
  )
}

const displaying = (show, pass) => ({
  opacity: show ? 1 : 0,
  pointerEvents: show ? "auto" : "none",
  transition: "0.3s",
  height: show || pass ? null : 0,
  width: show || pass ? null : 0,
  overflow: "hidden",
})
