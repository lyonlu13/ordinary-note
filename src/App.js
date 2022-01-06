import styled from 'styled-components';
import BackPatten from "components/BackPatten";
import { useEffect, useRef, useState } from 'react';
import 'katex/dist/katex.min.css';
import { observer } from "mobx-react-lite" // Or "mobx-react".
import { alignVertical, BlocksHolder, ImageBlock, MusicBlock, TextBlock } from 'define/blocks';
import Block from 'Blocks';
import { BiCurrentLocation } from "react-icons/bi";
import { FaMousePointer } from "react-icons/fa";
import { MdZoomOutMap } from "react-icons/md";
import { CommandBar } from './components/CommandBar/index';
import { overlapCheck, urlCheck } from 'utils/check';
import when from 'utils/flow';
import Icon from './components/Icon/index';
import IconButton from './components/IconButton/index';
import { alignHorizontal } from './define/blocks';
import Toolbox from './components/Toolbox/index';

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

const SelectingFrame = styled.div`
  position: fixed;
  width:100px;
  height:100px;
  border: 3px solid #4186b0;
  background-color: #b0e1ff55;
  z-index:4;
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

window.urlCheck = urlCheck

function App() {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const [offsetX, setOffsetX] = useState(500);
  const [offsetY, setOffsetY] = useState(100);

  // const [gapX, setGapX] = useState(0);
  // const [gapY, setGapY] = useState(0);

  const [zoom, setZoom] = useState(1);
  const [isHold, setHold] = useState(false);

  const [space, setSpace] = useState(false);

  const [selectedBlocks, setSelectedBlocks] = useState([]);

  const [selectingStart, setSelectingStart] = useState(null);

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
    } else if (e.button === 0) {
      setSelectingStart({ x: mouseX, y: mouseY })
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
        blocksHolder.new(new ImageBlock(null,
          pastingObject.file?.name || "",
          { pos: { x: 0, y: 0 } },
          {
            src: pastingObject.file
              ? URL.createObjectURL(pastingObject.file)
              : pastingObject.url,
            width: 300
          }).init())
        break
      case "audio":
        if (pastingObject.yt)
          blocksHolder.new(MusicBlock.createByYt(pastingObject.yt))
        else
          blocksHolder.new(MusicBlock.createByUrl(pastingObject.url))
        break
      default:
    }
  }

  function forwardPaste(pastingObject) {
    console.log(pastingObject);
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
            urlCheck(txt).then((res) => {
              console.log(res);
              if (res) {
                when(res)
                  .case("image", () => forwardPaste({
                    type: "image",
                    url: txt
                  }))
                  .case("audio", () => forwardPaste({
                    type: "audio",
                    url: txt
                  }))
                  .case("yt", () => forwardPaste({
                    type: "audio",
                    yt: txt
                  }))
                  .else(() => forwardPaste({
                    type: "text",
                    text: txt
                  }))
              } else forwardPaste({
                type: "text",
                text: txt
              })
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
      console.log(selectingStart.x, mouseX);
      const boundary = [
        { x: Math.min(mouseX, selectingStart.x), y: Math.min(mouseY, selectingStart.y) },
        { x: Math.max(mouseX, selectingStart.x), y: Math.max(mouseY, selectingStart.y) }
      ]
      setSelectedBlocks(blocksHolder.ids.filter((id) =>
        overlapCheck(boundary, blocksHolder.blocks[id].dom)
      ).map((id) => blocksHolder.blocks[id]))
      setSelectingStart(null)
    }

    document.onkeydown = (e) => {
      if (e.key === "Delete") {
        if (selectedBlocks.length >= 1)
          blocksHolder.remove(selectedBlocks)
      }
      else if (e.key === " ") {
        setSpace(true)
      }
    }

    document.onkeyup = (e) => {
      if (e.key === " ") {
        setSpace(false)
      }
    }

    document.onwheel = zooming
  }, [isDragging, isResizing, selectedBlocks, zoom, selectingStart, mouseX, mouseY])

  return (
    <>
      {selectingStart &&
        <SelectingFrame
          style={{
            top: Math.min(selectingStart.y, mouseY),
            left: Math.min(selectingStart.x, mouseX),
            width: Math.abs(mouseX - selectingStart.x),
            height: Math.abs(mouseY - selectingStart.y),
          }} />}
      <BackPatten type="grid" offsetX={offsetX} offsetY={offsetY} option={{ size: 30 * zoom, groupSize: 20 }} />
      <WorkSpace
        zooming={zooming}
        offsetX={offsetX}
        offsetY={offsetY}
        zoom={zoom}
        ids={blocksHolder.ids}
        selectedBlock={selected}
        draggingBlock={dragging}
        resizingBlock={resizing}
      />
      <Touch
        onMouseDown={mouseDown}
        onMouseMove={mouseMove}
        style={{
          cursor: isHold ? "grabbing" : (space ? "grab" : "auto")
        }} />

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
        <Display
          style={{
            opacity: selectedBlocks.length < 2 ? 0 : 1,
            pointerEvents: selectedBlocks.length < 2 ? "none" : "auto"
          }}>
          <DisplayTitle>排列</DisplayTitle>
          <div style={{ marginTop: 10, display: "flex", gap: 5 }}>
            <IconButton icon="align_v" color="#003D83" onClick={() => alignVertical(selectedBlocks, 20)} />
            <IconButton icon="align_h" color="#003D83" onClick={() => alignHorizontal(selectedBlocks, 20)} />
          </div>
        </Display>
      </RightPanel>
      <Toolbox />
      <CommandBar />
    </>
  );
}

export default App;
