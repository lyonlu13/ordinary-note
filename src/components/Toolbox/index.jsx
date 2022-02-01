import styled from "styled-components"
import Icon from 'components/Icon';
import Modal from './../Modal/index';
import { useState } from 'react';
import { castMap } from "define/blocks";
import { BlocksHolder } from './../../define/blocks';
import { Position } from "define/basic";

const Box = styled.div`
    position:fixed;
    right:0;
    bottom:40px;
    display:flex;
    gap:10px;
    padding:20px;
    z-index:8;
`

const Button = styled.span`
    width:50px;
    height:50px;
    border-radius:100px;
    background: white;
    display:inline-flex;
    justify-content:center;
    align-items:center;
    box-shadow:0px 0px 3px 1px gray;
    filter: brightness(1);
    transition:0.3s;
    cursor:pointer;
    &:hover:{
     filter: brightness(.9);
     background:red;
    }
`

const Item = styled.span`
    margin: 10px 0;
    width:100%;
    height:50px;
    border-radius:10px;
    background: white;
    display:inline-flex;
    justify-content:center;
    align-items:center;
    box-shadow:0px 0px 3px 1px gray;
    filter: brightness(1);
    transition:0.3s;
    cursor:pointer;
    &:hover:{
     filter: brightness(0.8);
    }
`


export default function Toolbox() {
    const [isOpen, setOpen] = useState(false)
    function addBlock(Type) {
        BlocksHolder.getInstance().new(new (Type)("_", new (Type)().info.name, { pos: new Position(500, 200) }, {}).init().new())
        setOpen(false)
    }
    return <Box>
        <Button onClick={() => setOpen(true)}>
            <Icon icon="add" color="#00AEFF"></Icon>
        </Button>
        <Modal isOpen={isOpen} setOpen={setOpen}>
            <h1 style={{ margin: 0 }}>新增方塊</h1>
            <hr style={{ background: "gray" }} />
            {Object.keys(castMap).map((key) => <Item onClick={() => addBlock(castMap[key])}>{new (castMap[key])().info.name}</Item>)}
        </Modal>
    </Box>
}