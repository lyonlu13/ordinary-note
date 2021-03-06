import { BlocksHolder } from 'define/blocks';
import { observer } from 'mobx-react-lite';
import { RiToolsFill } from "react-icons/ri";

import styled from 'styled-components';
import { useRef, useEffect } from 'react';
import Text from './Text';
import Image from './Image';
import Latex from './Latex';
import ArrayB from './Array';
import Music from './Music';

const blocksHolder = BlocksHolder.getInstance()

const ComponentsCast = {
    text: Text,
    image: Image,
    latex: Latex,
    array: ArrayB,
    music: Music,
}

export default observer(function Block({ offsetX, offsetY, zoom, id, selectedBlock, draggingBlock, resizingBlock }) {
    const model = blocksHolder.get(id)
    const isSelected = !!selectedBlock().find((item) => item.id === id)
    const isDragging = draggingBlock() && isSelected
    const ref = useRef(null)
    const domSet = useRef(false)

    useEffect(() => {
        if (!domSet.current && model) {
            model.setDom(ref.current)
            domSet.current = true
        }
    }, [model])

    return model ? <BlockBase
        ref={ref}
        x={20}
        y={20}
        offsetX={offsetX}
        offsetY={offsetY}
        zoom={zoom}
        color={model.color}
        style={{
            top: model.geometry.pos.y * zoom + offsetY,
            left: model.geometry.pos.x * zoom + offsetX,
            transform: `scale(${zoom * 100}%)`,
            filter: isDragging ? "drop-shadow(12px 12px 1px rgba(0, 0, 0, 0.1))" : "",
        }}
        onMouseUp={(e) => {
            if (isDragging) return
            if (e.shiftKey)
                selectedBlock([...selectedBlock(), model]);
            else
                selectedBlock([model]);
        }}
    >

        <Label
            color={model.info.color}
            onMouseDown={() => {
                if (selectedBlock().length === 1)
                    blocksHolder.sendToFront(model.id)
                draggingBlock(true)
            }}
            style={displaying(isSelected && !isDragging, isSelected && isDragging)}>
            {model.name || model.info.name}
        </Label>
        <Outline color={model.info.color} style={{ borderColor: (isSelected ? "" : "#ffffff00") }}>
            {((Component) => {
                return (
                    <Component
                        model={model}
                        draggingBlock={draggingBlock}
                        isSelected={isSelected}
                        selectedBlock={selectedBlock}
                        resizingBlock={resizingBlock} />)
            }
            )(ComponentsCast[model.type])}
        </Outline>

        {<DevLabel style={displaying(isSelected && !isDragging)}>
            <RiToolsFill style={{ verticalAlign: 'middle' }} />{id}
        </DevLabel>}
    </BlockBase > : null
})


const displaying = (show, holdable) => ({
    opacity: show ? 1 : 0,
    pointerEvents: (show || holdable) ? "auto" : "none",
    transition: "0.3s"
})


const BlockBase = styled.div`
  position:absolute;
  z-index:2;
  transform-origin: top left;
`

const Outline = styled.div`
  z-index:2;
  border: ${props => `2px solid ${props.color}`};
  transform-origin: top left;
  transition:0.3s;
`

const Label = styled.div`
  position:absolute;
  display: inline-block;
  background-color: ${props => props.color};
  color: white;
  padding :0 10px;
  transform: translateY(-100%);
  cursor: move;
  user-select: none;
  transition:0.3s;
  z-index:5;
`

const DevLabel = styled.div`
  position:absolute;
  display: inline-flex;
  background-color: #a3a3a3;
  color: white;
  padding :0 5px;
  bottom: 0;
  right:0;
  transform: translateY(100%);
  align-items: center;
  transition:0.3s;
`