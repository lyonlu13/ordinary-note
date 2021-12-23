import styled from 'styled-components';
import BackPatten from "components/BackPatten";
import { useEffect, useRef, useState } from 'react';
import 'katex/dist/katex.min.css';
import { observer } from "mobx-react-lite" // Or "mobx-react".
import { BlocksHolder, ImageBlock, TextBlock } from 'define/blocks';
import Block from 'Blocks';
import { BiCurrentLocation } from "react-icons/bi";
import { FaMousePointer } from "react-icons/fa";
import { MdZoomOutMap } from "react-icons/md";
import { CommandBar } from './components/CommandBar/index';

const Touch = styled.div`
  position:absolute;
  top:0;
  left:0;
  width:100vw;
  height:100vh;
  z-index:1;
`
const RightPanel = styled.div`
position:absolute;
top:20px;
right:20px;
display: flex;
flex-direction: column;
gap: 10px;
`

const DisplayTitle = styled.h3`
  margin:0;
`

const Display = styled.div`
  width:240px;
  padding:10px;
  z-index:2;
  background-color: white;
  overflow: hidden;
  border-radius: 2px;
  box-shadow: 1px 1px 5px 1px gray;
  transition: 0.3s;
`

const InfoLine = styled.div`
  display: flex;
  align-items:center;
  margin:5px 0;
`

const Tag = styled.div`
  gap: 2px;
  display: inline-flex;
  border-radius: 2px;
  background-color: ${props => props.bgColor};
  padding:2px 4px;
  color: white;
  align-items:center;
  margin-right:10px;
`

const blocksHolder = BlocksHolder.getInstance()


const WorkSpace = observer(function ({ offsetX, offsetY, zoom, ids, zooming, selectedBlock, draggingBlock, resizingBlock
}) {

  return <>
    {ids.map((id) => {
      return <Block
        key={id}
        offsetX={offsetX}
        offsetY={offsetY}
        zoom={zoom}
        id={id}
        selectedBlock={selectedBlock}
        draggingBlock={draggingBlock}
        resizingBlock={resizingBlock} />
    })}
  </>
})

async function doing() {
  const url = "https://www.youtube.com/watch?v=8MG--WuNW1Y"
  fetch(`http://localhost:8081/dl?url=${url}`)
    .then((res) => {
      return res.text();
    }).then((res) => {
      document.getElementById("test").src = res
    })
}

doing()

function App() {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const [offsetX, setOffsetX] = useState(500);
  const [offsetY, setOffsetY] = useState(100);

  const [gapX, setGapX] = useState(0);
  const [gapY, setGapY] = useState(0);

  const [zoom, setZoom] = useState(1);
  const [isHold, setHold] = useState(false);

  const [space, setSpace] = useState(false);

  const [selectedBlocks, setSelectedBlocks] = useState([]);


  const dragOffset = useRef({})
  const [isDragging, setDragging] = useState(false);

  const resizeOffset = useRef(null)
  const [isResizing, setResizing] = useState(false);

  const originOffset = useRef({ x: 0, y: 0 })
  const originMouse = useRef({ x: 0, y: 0 })

  function selected(target) {
    if (target !== undefined)
      setSelectedBlocks(target)
    return target || selectedBlocks
  }

  function dragging(isDrag) {
    if (isDrag)
      if (selectedBlocks.length > 0) {
        selectedBlocks.forEach(block => {
          dragOffset.current[block.id] = {
            x: block.dom.getBoundingClientRect().left - mouseX,
            y: block.dom.getBoundingClientRect().top - mouseY
          }
        });
      }

    if (isDrag !== undefined)
      setDragging(isDrag)
    return isDrag || isDragging
  }

  function resizing(isResize) {
    if (isResize) {
      resizeOffset.current = {
        width: selectedBlocks[0].data.width,
        x: mouseX,
      }
    }

    if (isResize !== undefined)
      setResizing(isResize)
    return isResize || isResizing
  }

  function mouseMove(e) {
    if (isHold) {
      window.requestAnimationFrame(() => {
        setOffsetX(originOffset.current.x - (originMouse.current.x - e.clientX))
        setOffsetY(originOffset.current.y - (originMouse.current.y - e.clientY))
      });
    }
  }

  function mouseDown(e) {
    if (space) {
      originOffset.current.x = offsetX
      originOffset.current.y = offsetY
      originMouse.current.x = e.clientX
      originMouse.current.y = e.clientY
      setHold(true)
    }
  }

  function zooming(e) {
    e = e || window.event
    if (e.deltaY > 0) {
      if (zoom > 0.5) {
        let after = zoom - 0.1

        // let X = e.clientX * after - e.clientX * zoom
        // let Y = e.clientY * after - e.clientY * zoom
        // setGapX(gapX - X)
        // setGapY(gapY - Y)
        setZoom(after)
      }
    } else {
      if (zoom < 2) {
        let after = zoom + 0.1

        // let X = e.clientX * after - e.clientX * zoom
        // let Y = e.clientY * after - e.clientY * zoom
        // setGapX(gapX - X)
        // setGapY(gapY - Y)
        setZoom(after)
      }
    }
  }

  function newBlockByPaste(pastingObject) {
    switch (pastingObject.type) {
      case "text":
        blocksHolder.new(new TextBlock(null, "新文字方塊", { pos: { x: 0, y: 0 } }, { text: pastingObject.text }).init())
        break
      case "image":
        blocksHolder.new(new ImageBlock(null, pastingObject.file.name, { pos: { x: 0, y: 0 } }, { src: URL.createObjectURL(pastingObject.file), width: 300 }).init())
        break
      default:
    }
  }

  function forwardPaste(pastingObject) {
    if (selectedBlocks.length === 1) {
      selectedBlocks[0].paste(pastingObject)
    } else {
      newBlockByPaste(pastingObject)
    }
  }

  useEffect(() => {
    document.onpaste = (e) => {
      const dT = e.clipboardData || window.clipboardData;
      const file = dT.files[0];
      if (file) {
        if (file.type.startsWith('image/')) {
          forwardPaste({
            type: "image",
            file: file
          })
        }
        if (file.type.startsWith('audio/'))
          forwardPaste({
            type: "audio",
            file: file
          })

      } else {
        if (dT.items[0])
          dT.items[0].getAsString((txt) => {
            forwardPaste({
              type: "text",
              text: txt
            })
          })
      }
    };

    document.onmousemove = (e) => {

      setMouseX(e.clientX)
      setMouseY(e.clientY)
      if (isDragging) {
        selectedBlocks.forEach((block) => {
          block.setPos((
            e.clientX + dragOffset.current[block.id].x - offsetX) / zoom,
            (e.clientY + dragOffset.current[block.id].y - offsetY) / zoom)
        })
      }
      if (isResizing) {
        const block = selectedBlocks[0]
        block.setWidth((e.clientX - resizeOffset.current.x) / zoom + resizeOffset.current.width)
      }
    }

    document.onmouseup = () => {
      setHold(false)
      dragging(false)
      resizing(false)
    }

    document.onkeydown = (e) => {
      if (e.key === "Delete") {
        if (selectedBlocks.length >= 1)
          blocksHolder.remove(selectedBlocks)
      }
      if (e.key === " ") {
        setSpace(true)
      }
    }

    document.onkeyup = (e) => {
      if (e.key === " ") {
        setSpace(false)
      }
    }

    document.onwheel = zooming
  }, [isDragging, isResizing, selectedBlocks, zoom])

  return (
    <>
      <BackPatten type="grid" offsetX={offsetX - gapX} offsetY={offsetY - gapY} option={{ size: 30 * zoom, groupSize: 20 }} />
      <WorkSpace
        zooming={zooming}
        offsetX={offsetX - gapX}
        offsetY={offsetY - gapY}
        zoom={zoom}
        ids={blocksHolder.ids}
        selectedBlock={selected}
        draggingBlock={dragging}
        resizingBlock={resizing}
      />
      <Touch
        onMouseDown={mouseDown}
        onMouseMove={mouseMove}
        onClick={() => selected([])}
        style={{
          cursor: isHold ? "grabbing" : (space ? "grab" : "auto")
        }} />
      {/* <Block
          x={30}
          y={0}
          offsetX={offsetX}
          offsetY={offsetY}
          zoom={zoom}
          color={"#00a2ff"}
          label={"Audio"}
        >
          <audio ref={ref} src="file:///D:\Users\Lyon\Desktop\test.mp3" controls="true"></audio>
        </Block>

        <Block
          x={300}
          y={150}
          offsetX={offsetX}
          offsetY={offsetY}
          zoom={zoom}
          color={"#ff008c"}
          label={"Text Area"}
        >
          <textarea name="" id="" cols="30" rows="10">
            I am invisible!!!!!!!
          </textarea>
        </Block>

        <Block
          x={200}
          y={400}
          offsetX={offsetX}
          offsetY={offsetY}
          zoom={zoom}
          color={"#7700ff"}
          label={"Text Area"}
        >
          <Input storage={st} />
          <Text storage={st} />
        </Block>

        <Block
          x={-330}
          y={90}
          offsetX={offsetX}
          offsetY={offsetY}
          zoom={zoom}
          color={"#00a808"}
          label={"LaTeX"}
        >
        </Block>

        <Block
          x={-300}
          y={260}
          offsetX={offsetX}
          offsetY={offsetY}
          zoom={zoom}
          color={"#ffc400"}
          label={"Image"}
        >
          <img ref={ref2} width="400" src="https://www.mirrormedia.com.tw/assets/images/20210811183042-492063c52c4c70e0ffe94db30f8395b8-mobile.jpg" alt="" />        </Block>

      */}
      <RightPanel>
        <Display>
          <DisplayTitle>資訊</DisplayTitle>
          <InfoLine>
            <Tag bgColor="#047BEB"><BiCurrentLocation /> Offset</Tag> ({offsetX},{offsetY})
          </InfoLine>
          <InfoLine>
            <Tag bgColor="#F3C600"><FaMousePointer /> Mouse</Tag> ({mouseX},{mouseY})
          </InfoLine>
          <InfoLine>
            <Tag bgColor="#006823"><MdZoomOutMap /> Zoom</Tag>{Math.round(zoom * 100)}%
          </InfoLine>
        </Display>
        <Display
          style={{
            opacity: selectedBlocks.length === 0 ? 0 : 1,
            pointerEvents: selectedBlocks.length === 0 ? "none" : "auto"
          }}>
          <DisplayTitle>屬性</DisplayTitle>
          {selectedBlocks.length > 1 &&
            <div>已選擇{selectedBlocks[0].getName()}與其他{selectedBlocks.length - 1}個元素</div>
          }
          <div id="attributes" style={{ marginTop: 10 }}>

          </div>
        </Display>
      </RightPanel>



      <CommandBar />
    </>
  );
}

export default App;
