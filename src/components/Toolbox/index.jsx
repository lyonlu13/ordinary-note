import styled from "styled-components"
import Icon from 'components/Icon';

const Box = styled.div`
    position:fixed;
    right:0;
    bottom:40px;
    display:flex;
    gap:10px;
    padding:20px;
    z-index:10;
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
`

export default function Toolbox() {
    return <Box><Button><Icon icon="awesome" color="#00AEFF"></Icon></Button></Box>
}