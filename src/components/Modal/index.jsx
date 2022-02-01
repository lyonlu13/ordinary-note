import { createPortal } from "react-dom";
import styled from 'styled-components';

const BackDrop = styled.div`
  position:absolute;
  top:0;
  left:0;
  width:100vw;
  height:100vh;
  display:flex;
  justify-content:center;
  align-items:center;
  background:#00000022;
  transition:0.3s;
  z-index:10;
`
const Card = styled.div`
  background:#FFFFFF;
  border-radius:10px;
  width:400px;
  height:80%;
  overflow-y:auto;
  padding:20px;
`

export default function Modal({ isOpen, setOpen, children }) {
  return createPortal(
    <BackDrop
      style={{
        pointerEvents: isOpen ? "auto" : "none",
        opacity: isOpen ? 1 : 0,
      }}
      onClick={() => setOpen(false)}>
      <Card
        onClick={(e) => e.stopPropagation()}>
        {children}
      </Card>
    </BackDrop>, document.getElementById("root"));
}