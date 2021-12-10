import { BlocksHolder } from 'define/blocks';
import { observer } from 'mobx-react-lite';
import { RiToolsFill } from "react-icons/ri";

import styled from 'styled-components';
import Text from './Text';
import Image from './Image';
import { useRef } from 'react';

const blocksHolder = BlocksHolder.getInstance()

const ComponentsCast = {
    text: Text,
    image: Image
}

export default observer(function Block({ offsetX, offsetY, zoom, id, selectedBlock, draggingBlock }) {
    const model = blocksHolder.get(id)

    const isSelected = selectedBlock()?.id === id
    const isDragging = draggingBlock()?.id === id
    const ref = useRef(null)
    return <BlockBase
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
            transition: "filter 0.3s"
        }}
        onClick={() => { selectedBlock(model); }}
    >

        <Label color={model.info.color} onMouseDown={() => { draggingBlock(model, ref.current) }} style={displaying(isSelected)}>
            {model.name}
        </Label>
        <Outline color={isSelected ? model.info.color : "#ffffff00"} style={{}}>
            {((Component) => {
                return <Component model={model} />
            }
            )(ComponentsCast[model.type])}
        </Outline>

        {
            <DevLabel style={displaying(isSelected)}>
                <RiToolsFill style={{ verticalAlign: 'middle' }} />{id}
            </DevLabel>}
    </BlockBase >
})


const displaying = (show) => ({
    opacity: show ? 1 : 0,
    pointerEvent: show ? "auto" : "none",
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