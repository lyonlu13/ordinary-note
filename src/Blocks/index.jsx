import { BlocksHolder } from 'define/blocks';
import { observer } from 'mobx-react-lite';
import { RiToolsFill } from "react-icons/ri";

import styled from 'styled-components';
import Text from './Text';
import Image from './Image';

const blocksHolder = BlocksHolder.getInstance()

const ComponentsCast = {
    text: Text,
    image: Image
}

export default observer(function Block({ offsetX, offsetY, zoom, id }) {
    const model = blocksHolder.get(id)
    return <BlockBase
        x={20}
        y={20}
        offsetX={offsetX}
        offsetY={offsetY}
        zoom={zoom}
        color={model.color}
        style={{
            top: model.geometry.pos.y * zoom + offsetY,
            left: model.geometry.pos.x * zoom + offsetX,
            transform: `scale(${zoom * 100}%)`
        }}
    >
        <Label color={model.info.color}>
            {model.name}
        </Label>
        <Outline color={model.info.color}>
            {((Component) => {
                return <Component model={model} />
            }
            )(ComponentsCast[model.type])}
        </Outline>
        <DevLabel>
            <RiToolsFill style={{ verticalAlign: 'middle' }} />{id}
        </DevLabel>
    </BlockBase >
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
`